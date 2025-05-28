import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { LiveTranscriptionPlugin } from './components/app/component';

const uuid = document.currentScript?.getAttribute('uuid') || 'root';

const root = ReactDOM.createRoot(document.getElementById(uuid));
root.render(
  <LiveTranscriptionPlugin {...{
    pluginUuid: uuid,
  }}
  />,
);
