import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

/** Прогресс-бар при подгрузке данных (indeterminate) */
export default function LinearDeterminate() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
}
