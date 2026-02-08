import { useCallback, useEffect, useState } from 'react';
import Input from '../../shared/ui/Input/Input';
import PaginationRounded from '../../shared/ui/Pagination/PaginationRounded';
import LinearDeterminate from '../../shared/ui/Loader/Loader';
import Checkbox from '../../shared/ui/Checkbox/Checkbox';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
} from '@mui/material';
import { useProductsStore, type SortField } from '../../store/products.store';
import type { Product } from '../../shared/types/product';
import styles from './Products.module.scss';

const SEARCH_DEBOUNCE_MS = 400;

function formatPrice(value: number): string {
  return value
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function capitalizeCategory(cat: string): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ');
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="18" r="1.5" />
    </svg>
  );
}

function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (!direction) return <span style={{ opacity: 0.4 }}>↕</span>;
  return <span>{direction === 'asc' ? '↑' : '↓'}</span>;
}

export default function Products() {
  const {
    items,
    loading,
    total,
    page,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    loadProducts,
    setPage,
    setSearchQuery,
    setSort,
  } = useProductsStore();

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', price: '', brand: '', sku: '' });
  const [toastOpen, setToastOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchInput);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput, setSearchQuery]);

  useEffect(() => {
    loadProducts();
  }, [page, searchQuery, sortBy, sortOrder, loadProducts]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const allSelected = items.length > 0 && items.every(p => selectedIds.has(p.id));
  const toggleAll = useCallback(() => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map(p => p.id)));
  }, [allSelected, items]);

  const toggleRow = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      setSort(field);
    },
    [setSort]
  );

  const handleRefresh = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddSubmit = useCallback(() => {
    if (!addForm.title.trim()) return;
    setAddModalOpen(false);
    setAddForm({ title: '', price: '', brand: '', sku: '' });
    setToastOpen(true);
  }, [addForm]);

  return (
    <div className={styles.productMainWrapper}>
      {/* Progress bar при подгрузке */}
      {loading && (
        <div className={styles.progressStrip}>
          <div className={styles.loader}>
            <LinearDeterminate />
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Товары</h1>
        <div className={styles.searchWrap}>
          <Input
            placeholder="Найти"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            iconLeft={<SearchIcon />}
          />
        </div>
      </div>

      {/* Section: Все позиции + кнопки */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Все позиции</h2>
        <div className={styles.actionsRow}>
          <IconButton
            className={styles.btnIcon}
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Обновить"
          >
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            className={styles.btnAddPrimary}
            startIcon={<PlusIcon />}
            onClick={() => setAddModalOpen(true)}
          >
            Добавить
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableContainer component={Paper} className={styles.productsTableWrapper} sx={{ boxShadow: 'none' }}>
        <Table className={styles.table} size="medium">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
              <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  style={{ marginRight: 4 }}
                />
              </TableCell>
              <TableCell>
             
                <span onClick={() => handleSort('title')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '16px' }}>
                  Наименование <SortIcon direction={sortBy === 'title' ? sortOrder : null} />
                </span>
              </TableCell>
              <TableCell>
                <span onClick={() => handleSort('brand')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '16px' }}>
                  Вендор <SortIcon direction={sortBy === 'brand' ? sortOrder : null} />
                </span>
              </TableCell>
              <TableCell>
                <span onClick={() => handleSort('sku')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '16px' }}>
                  Артикул <SortIcon direction={sortBy === 'sku' ? sortOrder : null} />
                </span>
              </TableCell>
              <TableCell>
                <span onClick={() => handleSort('rating')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '16px' }}>
                  Оценка <SortIcon direction={sortBy === 'rating' ? sortOrder : null} />
                </span>
              </TableCell>
              <TableCell>
                <span onClick={() => handleSort('price')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '16px' }}>
                  Цена, ₽ <SortIcon direction={sortBy === 'price' ? sortOrder : null} />
                </span>
              </TableCell>
              <TableCell padding="checkbox" width={60} />
              <TableCell padding="checkbox" width={60} />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((p: Product) => (
              <TableRow key={p.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.has(p.id)}
                    onCheckedChange={() => toggleRow(p.id)}
                    style={{ marginRight: 4 }}
                  />
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {p.thumbnail ? (
                      <img
                        src={p.thumbnail}
                        alt=""
                        className={styles.productImageIcon}
                      />
                    ) : (
                      <div className={styles.productImageIcon} style={{ background: '#e5e7eb' }} />
                    )}
                    <div className={styles.nameCell}>
                      <span className={styles.nameCellTitle}>{p.title}</span>
                      <span className={styles.nameCellCategory}>{capitalizeCategory(p.category)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>
                  <span className={p.rating < 3 ? styles.ratingLow : undefined}>
                    {p.rating.toFixed(1)}/5
                  </span>
                </TableCell>
                <TableCell>{formatPrice(p.price)}</TableCell>
                <TableCell padding="checkbox">
                  <IconButton className={styles.btnIcon} size="small" aria-label="Добавить">
                    <PlusIcon />
                  </IconButton>
                </TableCell>
                <TableCell padding="checkbox">
                  <IconButton className={styles.btnIcon} size="small" aria-label="Ещё">
                    <DotsIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer: пагинация */}
      <div className={styles.footerWrapper}>
        <div>
          Показано {from}-{to} из {total}
        </div>
        <PaginationRounded
          page={page}
          count={totalPages}
          onChange={(_, value) => {
            if (value !== page) setPage(value);
          }}
        />
      </div>

      {/* Модалка добавления товара */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить товар</DialogTitle>
        <DialogContent>
          <TextField
            label="Наименование"
            fullWidth
            margin="normal"
            value={addForm.title}
            onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
            required
          />
          <TextField
            label="Цена"
            fullWidth
            margin="normal"
            type="number"
            value={addForm.price}
            onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
          />
          <TextField
            label="Вендор"
            fullWidth
            margin="normal"
            value={addForm.brand}
            onChange={e => setAddForm(f => ({ ...f, brand: e.target.value }))}
          />
          <TextField
            label="Артикул"
            fullWidth
            margin="normal"
            value={addForm.sku}
            onChange={e => setAddForm(f => ({ ...f, sku: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleAddSubmit} disabled={!addForm.title.trim()}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast при успешном добавлении */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        message="Товар успешно добавлен"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
}
