import React from 'react';
import { AbhyvexaLogo } from './AbhyvexaLogo';

interface StudyWithAbhiLogoProps {
  className?: string;
  size?: number | string;
  showTagline?: boolean;
}

export const StudyWithAbhiLogo: React.FC<StudyWithAbhiLogoProps> = (props) => {
  return <AbhyvexaLogo {...props} />;
};

export { AbhyvexaLogo };
