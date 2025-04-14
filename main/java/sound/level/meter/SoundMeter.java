package sound.level.meter;

import android.Manifest;
import android.content.pm.PackageManager;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Locale;

public class SoundMeter extends CordovaPlugin {

    private static final String LOG_TAG = "SoundLevel";
    private int sampleRate = 44100;
    private int channelConfig = AudioFormat.CHANNEL_IN_MONO;
    private int audioEncoding = AudioFormat.ENCODING_PCM_16BIT;
    private AudioRecord audioRecord;
    private Thread audioThread;
    private boolean isRecording = false;
    private CallbackContext currentCallbackContext;

    private double minDecibel = Double.MAX_VALUE;
    private double maxDecibel = Double.MIN_VALUE;
    private double totalDecibel = 0;
    private int decibelCount = 0;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        currentCallbackContext = callbackContext;
        switch (action) {
            case "start":
                cordova.getThreadPool().execute(() -> startRecording(callbackContext));
                return true;
            case "stop":
                cordova.getThreadPool().execute(() -> stopRecording(callbackContext));
                return true;
            case "updateSettings":
                cordova.getThreadPool().execute(() -> updateSettings(args, callbackContext));
                return true;
        }
        return false;
    }

    private void updateSettings(JSONArray args, CallbackContext callbackContext) {
        try {
            JSONObject options = args.getJSONObject(0);

            if (options.has("sampleRate")) {
                sampleRate = options.getInt("sampleRate");
            }
            if (options.has("channelConfig")) {
                channelConfig = options.getInt("channelConfig");
            }
            if (options.has("audioEncoding")) {
                audioEncoding = options.getInt("audioEncoding");
            }

            callbackContext.success("Settings updated successfully");
        } catch (JSONException e) {
            callbackContext.error("Error updating settings: " + e.getMessage());
        }
    }

    private void startRecording(CallbackContext callbackContext) {
        currentCallbackContext = callbackContext;
        if (cordova.hasPermission(Manifest.permission.RECORD_AUDIO)) {
            start(callbackContext);
        } else {
            cordova.requestPermission(this, 0, Manifest.permission.RECORD_AUDIO);
        }
    }

    private void start(CallbackContext callbackContext) {
        try {
            resetStatistics();

            int bufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioEncoding);
            audioRecord = new AudioRecord(MediaRecorder.AudioSource.MIC, sampleRate, channelConfig, audioEncoding, bufferSize);

            if (audioRecord.getState() != AudioRecord.STATE_INITIALIZED) {
                callbackContext.error("AudioRecord initialization failed");
                return;
            }

            audioRecord.startRecording();
            isRecording = true;

            audioThread = new Thread(() -> processAudio(callbackContext));
            audioThread.start();

        } catch (SecurityException se) {
            Log.e(LOG_TAG, "Permission error", se);
            callbackContext.error("Recording failed due to missing permissions: " + se.getMessage());
        } catch (Exception e) {
            Log.e(LOG_TAG, "Error starting AudioRecord", e);
            callbackContext.error("Error starting recording: " + e.getMessage());
        }
    }

    private void processAudio(CallbackContext callbackContext) {
        int bufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioEncoding);
        short[] buffer = new short[bufferSize];

        while (isRecording) {
            int read = audioRecord.read(buffer, 0, buffer.length);
            if (read > 0) {
                double rms = 0.0;
                for (int i = 0; i < read; i++) {
                    rms += buffer[i] * buffer[i];
                }
                rms = Math.sqrt(rms / read);
                double decibel = rms > 0 ? 20 * Math.log10(rms) : 0;

                updateStatistics(decibel);

               // Log.d(LOG_TAG, "Current Sound Level: " + decibel + " dB");

                String resultData = String.format(Locale.US, "{\"current\":%.2f,\"min\":%.2f,\"max\":%.2f,\"avg\":%.2f}",
                        decibel, minDecibel, maxDecibel, getAverageDecibel());

                PluginResult result = new PluginResult(PluginResult.Status.OK, resultData);
                result.setKeepCallback(true);
                callbackContext.sendPluginResult(result);
            } else if (read == AudioRecord.ERROR_INVALID_OPERATION || read == AudioRecord.ERROR_BAD_VALUE) {
                Log.e(LOG_TAG, "AudioRecord read error: " + read);
            }
        }
    }

    private void stopRecording(CallbackContext callbackContext) {
        if (isRecording) {
            isRecording = false;
            if (audioRecord != null) {
                audioRecord.stop();
                audioRecord.release();
                audioRecord = null;
            }
            if (audioThread != null) {
                audioThread.interrupt();
                audioThread = null;
            }
            callbackContext.success("Recording stopped");
        } else {
            callbackContext.error("Recording is not active");
        }
    }

    private void resetStatistics() {
        minDecibel = Double.MAX_VALUE;
        maxDecibel = Double.MIN_VALUE;
        totalDecibel = 0;
        decibelCount = 0;
    }

    private void updateStatistics(double decibel) {
        if (decibel < minDecibel) {
            minDecibel = decibel;
        }
        if (decibel > maxDecibel) {
            maxDecibel = decibel;
        }
        totalDecibel += decibel;
        decibelCount++;
    }

    private double getAverageDecibel() {
        return decibelCount > 0 ? totalDecibel / decibelCount : 0;
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == 0) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                cordova.getThreadPool().execute(() -> start(currentCallbackContext));
            } else {
                currentCallbackContext.error("Permission denied for recording audio");
            }
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stopRecording(currentCallbackContext);
    }
}

