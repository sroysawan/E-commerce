import * as React from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const ViewButton = ({ view, setView }) => {
    const handleChange = (event, nextView) => {
        if (nextView !== null) {
          setView(nextView);
        }
      };

  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value="module" aria-label="module">
        <ViewModuleIcon />
      </ToggleButton>
      <ToggleButton value="list" aria-label="list">
        <ViewListIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
export default ViewButton

