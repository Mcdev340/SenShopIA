'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Mic, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isSending?: boolean;
  allowAttachments?: boolean;
  allowEmojis?: boolean;
  allowVoice?: boolean;
  className?: string;
}

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Écrivez votre message...',
  isSending = false,
  allowAttachments = false,
  allowEmojis = false,
  allowVoice = false,
  className = '',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceRecording = () => {
    if (!allowVoice) return;
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setMessage('🎤 Message vocal');
      }, 3000);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const quickEmojis = ['😊', '👍', '❤️', '🔥', '😂', '🎉', '👋', '🤔'];

  return (
    <div className={cn('border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900', className)}>
      {/* Pièces jointes */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-800">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
              <span className="text-gray-600 dark:text-gray-300 truncate max-w-[150px]">{file.name}</span>
              <button onClick={() => removeAttachment(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2 p-3">
        {/* Bouton pièce jointe */}
        {allowAttachments && (
          <>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Bouton emoji */}
        {allowEmojis && (
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Smile className="w-5 h-5" />
            </Button>
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 w-48">
                <div className="grid grid-cols-4 gap-1">
                  {quickEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiSelect(emoji)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled || isSending}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 min-h-[40px] max-h-[120px] py-2 px-3',
            'focus:ring-0 focus:outline-none',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />

        {/* Bouton vocal */}
        {allowVoice && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleVoiceRecording}
            disabled={disabled}
            className={cn(
              'p-2 transition-colors',
              isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            )}
          >
            <Mic className="w-5 h-5" />
          </Button>
        )}

        {/* Bouton envoyer */}
        <Button
          type="button"
          size="sm"
          onClick={handleSend}
          disabled={disabled || isSending || !message.trim()}
          className="p-2 px-4"
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}