import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './GlowingTypewriter.module.css';

interface GlowingTypewriterProps {
  texts: string[];
  speed?: number;
  delay?: number;
  fadeIn?: boolean;
  isTranscript?: boolean;
  className?: string;
  onStartCall?: () => void;
  isCallActive?: boolean;
}

const GlowingTypewriter: React.FC<GlowingTypewriterProps> = ({
  texts,
  speed = 50,
  delay = 1000,
  fadeIn = true,
  isTranscript = false,
  className = '',
  onStartCall,
  isCallActive = false,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const previousTextRef = useRef('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const breakIntoLines = useCallback((text: string): string[] => {
    const lines: string[] = [];
    const maxLineLength = 40;
    const words = text.split(' ');
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > maxLineLength) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += (currentLine ? ' ' : '') + word;
      }
    });
    if (currentLine) lines.push(currentLine.trim());
    return lines;
  }, []);

  // Auto-scroll to bottom when new text is added
  useEffect(() => {
    if (containerRef.current && isTranscript) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayText, isTranscript]);

  useEffect(() => {
    if (!texts.length) return;
    const currentText = texts[texts.length - 1] || '';

    if (isTranscript) {
      if (currentText === previousTextRef.current) {
        return;
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      let commonPrefixLength = 0;
      while (
        commonPrefixLength < previousTextRef.current.length &&
        commonPrefixLength < currentText.length &&
        previousTextRef.current[commonPrefixLength] === currentText[commonPrefixLength]
      ) {
        commonPrefixLength++;
      }

      setDisplayText(currentText.slice(0, commonPrefixLength));
      let charIndex = commonPrefixLength;

      const typeNextChar = () => {
        if (charIndex >= currentText.length) {
          previousTextRef.current = currentText;
          return;
        }

        setDisplayText(currentText.slice(0, charIndex + 1));
        charIndex++;
        typingTimeoutRef.current = setTimeout(typeNextChar, speed / 3);
      };

      typeNextChar();

      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    } else {
      setCurrentOffset(0);
      const lines = breakIntoLines(currentText);
      const maxOffset = Math.max(...lines.map(line => Math.ceil(line.length / 2)));
      
      const interval = setInterval(() => {
        setCurrentOffset(prev => {
          if (prev >= maxOffset) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, speed);

      return () => clearInterval(interval);
    }
  }, [texts, speed, isTranscript, breakIntoLines]);

  const renderText = useCallback(() => {
    if (!texts.length) return null;
    const currentText = texts[texts.length - 1] || '';

    if (isTranscript) {
      return displayText;
    }

    const lines = breakIntoLines(currentText);
    return lines.map((line, i) => {
      const chars = line.split('');
      const centerIndex = Math.floor(chars.length / 2);
      
      return (
        <div key={i} className={styles.line}>
          {chars.map((char, j) => {
            const distanceFromCenter = Math.abs(j - centerIndex);
            const isVisible = distanceFromCenter <= currentOffset;
            return (
              <span
                key={j}
                className={`${styles.char} ${isVisible ? styles.visible : ''}`}
                style={{ 
                  transitionDelay: `${distanceFromCenter * (speed / 1000)}s`,
                  opacity: fadeIn ? (isVisible ? 1 : 0) : 1
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      );
    });
  }, [texts, currentOffset, speed, fadeIn, isTranscript, displayText, breakIntoLines]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div 
        ref={containerRef}
        className={`${styles.transcriptContainer} ${isTranscript ? styles.transcriptMode : ''}`}
      >
        <div className={styles.transcriptInner}>
          <div className={styles.transcript}>{renderText()}</div>
        </div>
      </div>
      {onStartCall && (
        <button 
          onClick={onStartCall}
          disabled={isCallActive}
          className={styles.startButton}
        >
          {isCallActive ? 'Call in Progress...' : 'Start Conversation'}
        </button>
      )}
    </div>
  );
};

export default GlowingTypewriter;
