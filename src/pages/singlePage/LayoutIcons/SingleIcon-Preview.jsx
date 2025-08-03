import React from 'react';
import { Container, Grid, Typography, useMediaQuery } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ScrollLoader } from '../../loading/messageScroll';
import Theme from '../../../theme/theme';
import { useIcon } from '../../../hooks/iconContext';
import SvgReader from './svgReader';

const SingleIconPreview = ({
  loading,
  previews,
  pagination,
  fetchMoreData,
  heightMissing,
  toggleFilter,
  toggleCustomizer,
  setToggleCustomizer,
}) => {
  const { icon, setIcon, styleIcon } = useIcon();
  const matchUpXl = useMediaQuery(Theme.breakpoints.up('xl'));
  const matchDownXl = useMediaQuery(Theme.breakpoints.down('xl'));
  const matchDownLg = useMediaQuery(Theme.breakpoints.down('lg'));
  const matchDownMd = useMediaQuery(Theme.breakpoints.down('md'));
  const matchDownSm = useMediaQuery(Theme.breakpoints.down('sm'));

  // Agrupa os previews por categoria
  const groupedPreviews = React.useMemo(() => {
    if (previews.length === 0) return {};

    const groups = {};
    previews.forEach((preview) => {
      const categories =
        preview.categories?.length > 0
          ? preview.categories
          : [{ name: 'Sem Categoria', term_id: 0 }];

      categories.forEach((category) => {
        if (!groups[category.term_id]) {
          groups[category.term_id] = {
            category,
            previews: [],
          };
        }
        if (
          !groups[category.term_id].previews.some((p) => p.id === preview.id)
        ) {
          groups[category.term_id].previews.push(preview);
        }
      });
    });

    return groups;
  }, [previews]);

  if (loading && pagination.currentPage === 1) {
    return 'Carregando...';
  }

  return (
    <InfiniteScroll
      dataLength={previews.length}
      next={fetchMoreData}
      hasMore={pagination.hasMore}
      loader={
        <Container className="page-anima">
          <ScrollLoader />
        </Container>
      }
      endMessage={
        <Typography
          sx={{ py: 2, mt: 6, mb: 3, textAlign: 'center', fontWeight: 'bold' }}
        >
          Você viu todos os {pagination.totalItems} ícones!
        </Typography>
      }
      scrollThreshold={`${heightMissing + 100}px`}
    >
      {Object.values(groupedPreviews).map((group, index) => (
        <div key={`category-${group.category.term_id}-${index}`}>
          <Typography
            variant="body2"
            className="category-title"
            sx={{
              mt: index > 0 ? 4 : 0,
              mb: 2,
            }}
          >
            {group.category.name}
          </Typography>

          <Grid container>
            {group.previews.map((preview) => (
              <Grid
                item
                className={
                  icon.idIcon > 0
                    ? icon.idIcon === preview.id
                      ? 'preview-item seleted'
                      : 'preview-item'
                    : 'preview-item'
                }
                key={preview.id}
                size={
                  matchDownSm
                    ? 6
                    : matchDownMd
                    ? 4
                    : matchDownLg
                    ? toggleFilter && toggleCustomizer
                      ? 4
                      : 3
                    : matchDownXl
                    ? toggleFilter && toggleCustomizer
                      ? 3
                      : 2
                    : matchUpXl
                    ? toggleFilter && toggleCustomizer
                      ? 2
                      : 2
                    : 1
                }
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                onClick={() =>
                  setIcon((prev) => ({ ...prev, idIcon: preview.id })) +
                  setIcon((prev) => ({
                    ...prev,
                    nameFile: preview.title?.replace('.svg', ''),
                  })) +
                  setToggleCustomizer(true)
                }
              >
                <SvgReader svgUrl={preview.url} />
                <Typography variant="caption" noWrap sx={{ width: '100%' }}>
                  {preview.title?.replace('.svg', '')}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default SingleIconPreview;
