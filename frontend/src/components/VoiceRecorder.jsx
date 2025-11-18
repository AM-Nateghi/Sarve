import { useState, useRef, useEffect } from 'react';
import {
  MicrophoneIcon,
  StopIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const VoiceRecorder = ({ onTranscriptReady, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  // راه‌اندازی Web Speech API برای تشخیص گفتار
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fa-IR'; // فارسی

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript((prev) => prev + finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          toast.error('خطا در تشخیص گفتار');
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
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

      // شروع تایمر
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // شروع تشخیص گفتار
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Recognition start error:', error);
        }
      }

      toast.success('ضبط شروع شد');
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

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Recognition stop error:', error);
        }
      }

      toast.success('ضبط متوقف شد');
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscriptReady(transcript.trim());
      setTranscript('');
      setAudioBlob(null);
      setRecordingTime(0);
    } else {
      toast.error('لطفاً ابتدا چیزی بگویید');
    }
  };

  const handleCancel = () => {
    setTranscript('');
    setAudioBlob(null);
    setRecordingTime(0);
    setIsRecording(false);

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Recognition stop error:', error);
      }
    }

    onClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleCancel}
    >
      <div
        className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text">
            ضبط صوتی
          </h3>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-light-text dark:text-dark-text" />
          </button>
        </div>

        {/* نمایش زمان ضبط */}
        {isRecording && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-mono text-lg font-bold text-red-600 dark:text-red-400">
                {formatTime(recordingTime)}
              </span>
            </div>
          </div>
        )}

        {/* نمایش متن تشخیص داده شده */}
        {transcript && (
          <div className="mb-4 p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border max-h-48 overflow-y-auto">
            <p className="text-sm text-light-text dark:text-dark-text leading-relaxed text-right">
              {transcript}
            </p>
          </div>
        )}

        {/* دکمه‌های کنترل */}
        <div className="flex gap-3">
          {!isRecording && !transcript && (
            <button
              onClick={startRecording}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-bold transition-colors"
            >
              <MicrophoneIcon className="w-6 h-6" />
              <span>شروع ضبط</span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-bold transition-colors"
            >
              <StopIcon className="w-6 h-6" />
              <span>توقف</span>
            </button>
          )}

          {!isRecording && transcript && (
            <>
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-light-text dark:text-dark-text px-6 py-4 rounded-xl font-bold transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
                <span>لغو</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-4 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-6 h-6" />
                <span>ارسال</span>
              </button>
            </>
          )}
        </div>

        {/* راهنما */}
        <div className="mt-4 text-xs text-light-text-tertiary dark:text-dark-text-tertiary text-center">
          {isRecording
            ? 'در حال ضبط... متن شما به صورت خودکار استخراج می‌شود'
            : 'روی دکمه شروع ضبط کلیک کنید و وظایف خود را بیان کنید'}
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceRecorder;
