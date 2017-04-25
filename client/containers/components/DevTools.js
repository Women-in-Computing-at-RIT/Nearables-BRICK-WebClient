import React from 'react';

import { createDevTools } from 'redux-devtools';
import FilterLogMonitor from 'redux-devtools-filterable-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import DiffMonitor from 'redux-devtools-diff-monitor';
import Inspector from 'redux-devtools-inspector';

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h"
               changePositionKey="ctrl-q"
               changeMonitorKey="ctrl-m"
               defaultIsVisible={false}
               defaultPosition="bottom"
               defaultSize={0.3}
  >
    <FilterLogMonitor />
    <Inspector theme="materia" />
    <DiffMonitor theme="materia" />
  </DockMonitor>
);

export default DevTools;