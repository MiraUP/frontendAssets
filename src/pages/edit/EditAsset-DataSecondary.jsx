import {
  CircularProgress,
  Grid,
  TextField,
  Typography,
  useColorScheme,
} from '@mui/material';
import React from 'react';
import Icon from '../../components/icon/icon';
import { useAlert } from '../../hooks/alertContext';

const EditAssetDataSecondary = ({
  loading,
  loadingUpdate,
  formData,
  setFormData,
}) => {
  const { mode } = useColorScheme();
  const showAlert = useAlert();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <fieldset className="edit-contentEdit" style={{ marginTop: '20px' }}>
      <legend>
        <Typography variant="h4" className="title">
          <Icon icon="edit" /> Dados Secundários
        </Typography>
      </legend>

      <div className={`loadingUpdate${loadingUpdate ? ' show' : ''}`}>
        <CircularProgress color={mode === 'dark' ? 'white' : 'black'} />
        <Typography variant="body2">
          Aguarde, isso pode demorar um pouco...
        </Typography>
      </div>

      <Grid container spacing={3}>
        <Grid size={12}>
          <TextField
            fullWidth
            required
            id="content"
            name="content"
            onChange={handleInputChange}
            color="info"
            label="Descrição do Ativo"
            value={formData.content}
            multiline
            rows={8}
            defaultValue={formData.content}
          />
        </Grid>
      </Grid>
    </fieldset>
  );
};

export default EditAssetDataSecondary;
