import React from 'react';
import { useParams } from 'react-router-dom';
import { ASSETS_GET } from '../../hooks/useFetch';
import { useAlert } from '../../hooks/alertContext';
import HeadConfig from '../../components/headConfig';
import {
  ProgressCircular,
  ProgressScroll,
} from '../../components/progressScroll/progress';
import PageSearch from '../search/pageSearch';
import Header from '../../layout/header';
import { useMediaQuery } from '@mui/material';
import { UserContext } from '../../hooks/userContext';
import Theme from '../../theme/theme';
import SingleLayoutIllustration from './Single-LayoutIllustration';
import SingleLayoutIcon from './Single-LayoutIcon';

const SinglePage = () => {
  const token = window.localStorage.getItem('token');
  const { data } = React.useContext(UserContext);
  const { slug } = useParams();
  const showAlert = useAlert();
  const [dataAsset, setDataAsset] = React.useState();
  const [loadingAsset, setLoadingAsset] = React.useState(true);
  const matchDownSm = useMediaQuery(Theme.breakpoints.down('sm'));
  const matchDownMd = useMediaQuery(Theme.breakpoints.down('md'));
  const matchDownLg = useMediaQuery(Theme.breakpoints.down('lg'));
  const [toggleInfo, setToggleInfo] = React.useState(
    matchDownSm ? false : true,
  );
  const [toggleFilter, setToggleFilter] = React.useState(
    matchDownLg ? false : true,
  );
  const [toggleCustomizer, setToggleCustomizer] = React.useState(
    matchDownMd ? false : false,
  );

  React.useEffect(() => {
    setLoadingAsset(true);
    async function getSingleAssets() {
      try {
        const { url, options } = ASSETS_GET(token);
        const response = await fetch(`${url}/${slug}`, options);
        const json = await response.json();

        if (json.code === 'post_not_found') {
          showAlert(json.message, 'error');
          setDataAsset();
        } else {
          setDataAsset(json.data);
        }
      } catch (err) {
        showAlert(err.message || err, 'error');
      } finally {
        setLoadingAsset(false);
      }
    }
    getSingleAssets();
  }, [slug]);

  const BasicsComponents = () => {
    return (
      <>
        <HeadConfig
          title={`${dataAsset && dataAsset.title}`}
          description={`Página do ativo ${dataAsset && dataAsset.title}`}
          page="asset"
        />
        <ProgressScroll />
        <PageSearch />
      </>
    );
  };

  if (dataAsset) {
    if (dataAsset.category !== false && dataAsset.category[0].slug === 'icon') {
      return (
        <>
          <BasicsComponents />
          <Header />
          <SingleLayoutIcon
            loadingAsset={loadingAsset}
            dataAsset={dataAsset}
            dataUser={data.data}
            toggleFilter={toggleFilter}
            setToggleFilter={setToggleFilter}
            toggleCustomizer={toggleCustomizer}
            setToggleCustomizer={setToggleCustomizer}
          />
        </>
      );
    } else if (
      dataAsset.category !== false &&
      dataAsset.category[0].slug !== 'icon'
    ) {
      return (
        <>
          <BasicsComponents />
          <Header />
          <SingleLayoutIllustration
            loadingAsset={loadingAsset}
            dataAsset={dataAsset}
            dataUser={data.data}
            toggleInfo={toggleInfo}
            setToggleInfo={setToggleInfo}
          />
        </>
      );
    } else {
      return <>Ativo sem categoria</>;
    }
  } else {
    return (
      <>
        <ProgressCircular />
      </>
    );
  }
};

export default React.memo(SinglePage);
