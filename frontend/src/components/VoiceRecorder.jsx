import { useState, useRef } from 'react';
import {
  MicrophoneIcon,
  StopIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import aiApi from '../services/aiApi';

const VoiceRecorder = ({ onTasksExtracted, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast.success('ضبط صوت شروع شد');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('خطا در دسترسی به میکروفون');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      toast.success('ضبط متوقف شد');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioBlob(file);
        toast.success('فایل صوتی بارگذاری شد');
      } else {
        toast.error('لطفاً یک فایل صوتی انتخاب کنید');
      }
    }
  };

  const handleExtractTasks = async () => {
    if (!audioBlob) {
      toast.error('لطفاً ابتدا صوت را ضبط یا بارگذاری کنید');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await aiApi.transcribeAndExtractTasks(audioBlob);
      if (result.success) {
        if (result.tasks && result.tasks.length > 0) {
          onTasksExtracted(result.tasks);
          toast.success(`${result.tasks.length} وظیفه از صوت استخراج شد`);
        } else {
          toast.info('صوت به متن تبدیل شد اما وظیفه‌ای یافت نشد');
          onTasksExtracted([]);
        }
        onClose();
      } else {
        toast.error('خطا در پردازش صوت');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error(error.message || 'خطا در پردازش صوت');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setAudioBlob(null);
    setRecordingTime(0);
    setIsRecording(false);
    onClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={handleCancel}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-dark-bg-secondary w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ضبط یا آپلود صوت
          </h3>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Recording Timer */}
          {isRecording && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
              <span className="font-mono text-3xl font-bold text-red-500">
                {formatTime(recordingTime)}
              </span>
              <p className="text-sm text-gray-500">در حال ضبط...</p>
            </motion.div>
          )}

          {/* Audio Info */}
          {audioBlob && !isRecording && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <MicrophoneIcon className="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  فایل صوتی آماده
                </p>
                <p className="text-xs text-gray-500">
                  {recordingTime > 0 ? `${formatTime(recordingTime)}` : 'آپلود شده'}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {!isRecording && !audioBlob && (
              <>
                <button
                  onClick={startRecording}
                  className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-medium transition-all active:scale-95"
                >
                  <MicrophoneIcon className="w-5 h-5" />
                  <span>شروع ضبط صوت</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-dark-bg-secondary text-gray-500">
                      یا
                    </span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-4 rounded-xl font-medium transition-all active:scale-95"
                >
                  <ArrowUpTrayIcon className="w-5 h-5" />
                  <span>آپلود فایل صوتی</span>
                </button>
              </>
            )}

            {isRecording && (
              <button
                onClick={stopRecording}
                className="w-full flex items-center justify-center gap-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-medium transition-all active:scale-95"
              >
                <StopIcon className="w-5 h-5" />
                <span>توقف ضبط</span>
              </button>
            )}

            {!isRecording && audioBlob && (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-xl font-medium transition-all active:scale-95"
                >
                  <XMarkIcon className="w-5 h-5" />
                  <span>لغو</span>
                </button>
                <button
                  onClick={handleExtractTasks}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>در حال پردازش...</span>
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5" />
                      <span>استخراج وظایف</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VoiceRecorder;
