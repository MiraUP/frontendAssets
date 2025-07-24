import React from 'react';
import { Container, Dialog, Grow } from '@mui/material';
import SearchInput from './Search-Input';
import { useSearch } from '../../hooks/searchContext';
import SearchFilter from './Search-Filter';
import { useAlert } from '../../hooks/alertContext';
import { ASSETS_SEARCH } from '../../hooks/useFetch';
import SearchResult from './Search-result';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

const pageSearch = () => {
  const token = window.localStorage.getItem('token');
  const { isSearchOpen, closeSearch, filters, searchQuery } = useSearch();
  const [openFilter, setOpenFilter] = React.useState(true);
  const [searchData, setSearchData] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const showAlert = useAlert();

  const searchResults = React.useCallback(
    async (page = 1) => {
      setIsLoading(true);
      const params = new URLSearchParams();

      params.append('search', searchQuery);
      params.append('page', page);
      params.append('total', 10); // Itens por página

      if (filters.favoritesOnly) {
        params.append('favorite', 'true');
      }

      if (filters.category.length > 0) {
        params.append('category', filters.category.join(','));
      }

      if (filters.compatibility.length > 0) {
        params.append('compatibility', filters.compatibility.join(','));
      }

      if (filters.origin.length > 0) {
        params.append('origin', filters.origin.join(','));
      }

      if (filters.developer.length > 0) {
        params.append('developer', filters.developer.join(','));
      }

      if (searchQuery.length > 0) {
        try {
          const { url, options } = ASSETS_SEARCH(token);
          const response = await fetch(`${url}?${params.toString()}`, options);
          const json = await response.json();

          if (page === 1) {
            setSearchData(json.data);
          } else {
            setSearchData((prev) => [...prev, ...json.data]);
          }

          setTotalPages(json.total_pages || 1);
          setCurrentPage(page);
          setHasMore(page < (json.total_pages || 1));
          setMessage(json.message);
        } catch (err) {
          showAlert(
            err.message || 'Ocorreu um erro ao fazer a pesquisa.',
            'error',
          );
        } finally {
          setIsLoading(false);
        }
      }
    },
    [filters, searchQuery, token],
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setSearchData([]);
      setHasMore(true);
      searchResults(1);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timer);
  }, [filters, searchQuery]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      searchResults(currentPage + 1);
    }
  };

  return (
    <>
      <Dialog
        fullScreen
        open={isSearchOpen}
        onClose={closeSearch}
        slots={{
          transition: Transition,
        }}
        className="search"
      >
        <SearchInput />
        <div className="page-anima">
          <Container
            maxWidth="xl"
            sx={{ display: 'flex', gap: '30px', position: 'relative' }}
          >
            <SearchFilter open={openFilter} setOpen={setOpenFilter} />
            <SearchResult
              open={openFilter}
              searchData={searchData}
              loadMore={loadMore}
              hasMore={hasMore}
              isLoading={isLoading}
              searchQuery={searchQuery}
              message={message}
            />
          </Container>
        </div>
      </Dialog>
    </>
  );
};

export default React.memo(pageSearch);
