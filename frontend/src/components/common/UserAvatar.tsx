import React, { useState, useEffect } from 'react';

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Extra classes for the optional remote image */
  imgClassName?: string;
}

const SIZE_CLASSES: Record<NonNullable<UserAvatarProps['size']>, string> = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-7 h-7 text-xs',
  lg: 'w-10 h-10 text-sm',
};

function getInitial(name?: string | null, email?: string | null): string {
  const fromName = name?.trim()?.charAt(0);
  if (fromName) return fromName.toUpperCase();
  const fromEmail = email?.trim()?.charAt(0);
  if (fromEmail) return fromEmail.toUpperCase();
  return 'U';
}

/**
 * Initials-first avatar. Tries a remote `src` when provided; on load error
 * falls back to the branded initials circle (avoids broken-image icons after Google login).
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  email,
  src,
  size = 'sm',
  className = '',
  imgClassName = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const initial = getInitial(name, email);
  const showImage = Boolean(src) && !imgFailed;

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full border border-[#721B29] bg-[#721B29] text-white font-bold shrink-0 overflow-hidden ${SIZE_CLASSES[size]} ${className}`}
      aria-hidden={showImage ? undefined : true}
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : `${name || email || 'User'} avatar`}
    >
      <span className="select-none leading-none">{initial}</span>
      {showImage && (
        <img
          src={src!}
          alt={name || email || 'User'}
          className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
          onError={() => setImgFailed(true)}
          referrerPolicy="no-referrer"
        />
      )}
    </span>
  );
};
