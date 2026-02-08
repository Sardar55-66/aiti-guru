import Pagination from '@mui/material/Pagination';

interface PaginationRoundedProps {
  page: number;
  count: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function PaginationRounded({ page, count, onChange }: PaginationRoundedProps) {
  return (
    <Pagination
      shape="rounded"
      page={page}
      count={count}
      onChange={onChange}
      sx={{
        '& .MuiPaginationItem-root': {
          '&:hover': {
            backgroundColor: '#242EDB',
          },
        },
        '& .MuiPaginationItem-root.Mui-selected': {
          backgroundColor: '#797FEA',
          '&:hover': {
            backgroundColor: '#242EDB',
          },
        },
      }}
    />
  );
}