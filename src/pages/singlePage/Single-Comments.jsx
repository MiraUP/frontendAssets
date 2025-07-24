import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/material';
import React from 'react';
import Icon from '../../components/icon/icon';
import { useAlert } from '../../hooks/alertContext';
import {
  COMMENT_DELETE,
  COMMENT_GET,
  COMMENT_POST,
  COMMENT_PUT,
} from '../../hooks/useFetch';
import SkeletonMUP from '../../components/skeleton/skeleton';
import AvatarMUP from '../../components/avatar/avatar';
import { BaseColors } from '../../theme/theme';

const SingleComments = ({ loading, dataAsset, dataUser, setDivComments }) => {
  const token = window.localStorage.getItem('token');
  const { mode } = useColorScheme();
  const [dataComments, setDataComments] = React.useState([]);
  const [loadingComments, setLoadingComments] = React.useState();
  const showAlert = useAlert();
  const [newComment, setNewComment] = React.useState('');
  const [isPosting, setIsPosting] = React.useState(false);
  const [editComment, setEditComment] = React.useState({
    id: null,
    isEditing: false,
  });
  const [editedComment, setEditedComment] = React.useState();
  const [isPostingEdit, setIsPostingEdit] = React.useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = React.useState({
    dialog: false,
    id: null,
    content: '',
  });
  const refDivComments = React.useRef(null);

  React.useEffect(() => {
    if (refDivComments.current) {
      setDivComments(refDivComments.current.getBoundingClientRect().height);
    }
  }, [dataComments, window.scrollY]);

  //Busca lista de comentários
  React.useEffect(() => {
    setLoadingComments(true);
    async function getComments() {
      try {
        const { url, options } = COMMENT_GET(token);
        const response = await fetch(`${url}/${dataAsset.id}`, options);
        const json = await response.json();
        if (json.code === 'post_not_found') {
          showAlert(json.message, 'error');
          setDataComments();
        } else {
          setDataComments(json);
        }
      } catch (err) {
        showAlert(err.message || err, 'error');
        setLoadingComments(false);
      } finally {
        setLoadingComments(false);
      }
    }
    getComments();
  }, [dataAsset]);

  //Posta um novo comentário
  const submitPostComment = async (event) => {
    event.preventDefault();

    if (!newComment.trim()) {
      showAlert('O comentário não pode estar vazio', 'warning');
      return;
    }

    setIsPosting(true);
    try {
      const { url, options } = COMMENT_POST(token, newComment);
      const response = await fetch(`${url}/${dataAsset.id}`, options);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Erro ao postar comentário');
      }

      showAlert('Comentário postado com sucesso!', 'success');
      setNewComment('');

      setDataComments((prev) => {
        const existingComments = prev?.data || [];

        return {
          ...prev,
          data: [
            {
              id: json.data.id,
              author: dataUser.username,
              author_id: dataUser.id,
              author_roles: [dataUser.role],
              content: newComment,
              created_at: new Date().toISOString(),
              date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            ...existingComments,
          ],
        };
      });
    } catch (err) {
      showAlert(err.message || 'Erro ao postar comentário', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  //Edita um comentário
  const handlePutComment = (id) => {
    async function putComment() {
      if (!editedComment.trim()) {
        showAlert('O comentário não pode estar vazio', 'warning');
        return;
      }

      setIsPostingEdit(true);
      try {
        const { url, options } = COMMENT_PUT(token, editedComment);
        const response = await fetch(`${url}/${id}`, options);
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.message || 'Erro ao editar esse comentário');
        }

        setDataComments((prev) => ({
          ...prev,
          data: prev.data.map((comment) =>
            comment.id === id
              ? {
                  ...comment,
                  content: editedComment,
                }
              : comment,
          ),
        }));

        showAlert('Comentário editado!', 'success');
      } catch (err) {
        showAlert(err.message || 'Erro ao editar esse comentário', 'error');
      } finally {
        setEditComment((prev) => ({
          id,
          isEditing: prev.id === id ? !prev.isEditing : false,
        }));
        setIsPostingEdit(false);
      }
    }
    putComment();
  };

  const handleOpenConfirmDelete = (id, content) => {
    setOpenConfirmDelete({ dialog: true, id, content });
  };

  const handleCloseConfirmDelete = (content) => {
    setOpenConfirmDelete({
      dialog: false,
      id: null,
      content,
    });
  };

  const handleConfirmedDelete = (id, content) => {
    async function deleteComment() {
      try {
        const { url, options } = COMMENT_DELETE(token);
        const response = await fetch(`${url}/${id}`, options);
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.message || 'Erro ao postar comentário');
        }

        setDataComments((prev) => ({
          ...prev,
          data: prev.data.filter((comment) => comment.id !== id),
        }));

        showAlert('Comentário postado com sucesso!', 'success');
      } catch (err) {
        showAlert(err.message || 'Erro ao postar comentário', 'error');
      } finally {
        setOpenConfirmDelete({
          dialog: false,
          id: null,
          content,
        });
      }
    }
    deleteComment();
  };

  return (
    <Container className="comments" ref={refDivComments}>
      <Grid>
        <Grid>
          <Box>
            <Typography
              component="h2"
              variant="h3"
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'start',
                alignItems: 'center',
              }}
            >
              <Icon icon="comment" size={30} />
              Comentários
            </Typography>
          </Box>
          <Box>
            {loadingComments ? (
              <>
                <SkeletonMUP
                  num={1}
                  width="80%"
                  height="20px"
                  style={{ margin: '40px 0 10px 0' }}
                />
                <SkeletonMUP
                  num={1}
                  width="100%"
                  height="50px"
                  style={{ marginBottom: '30px' }}
                />
                <SkeletonMUP
                  num={1}
                  width="80%"
                  height="20px"
                  style={{ marginBottom: '10px' }}
                />
                <SkeletonMUP
                  num={1}
                  width="100%"
                  height="50px"
                  style={{ marginBottom: '30px' }}
                />
              </>
            ) : dataComments.data && dataComments.data.length > 0 ? (
              dataComments.data.map(
                ({
                  id,
                  author,
                  author_id,
                  author_roles,
                  content,
                  date,
                  author_photo,
                }) => (
                  <Card
                    key={id}
                    className="comment-single content-group"
                    elevation={0}
                  >
                    <CardHeader
                      avatar={
                        !author_photo ? (
                          <AvatarMUP
                            size={56}
                            emotion="Happy"
                            user={author_id}
                          />
                        ) : (
                          <Avatar
                            alt={author}
                            src={author_photo}
                            sx={{ width: '56px', height: '56px' }}
                          />
                        )
                      }
                      title={
                        <>
                          {author}{' '}
                          <Chip
                            label={
                              author_roles[0] === 'administrator'
                                ? 'Administrador'
                                : author_roles[0] === 'editor'
                                ? 'Editor'
                                : author_roles[0] === 'author'
                                ? 'Autor'
                                : author_roles[0] === 'contributor'
                                ? 'Contribuidor'
                                : author_roles[0] === 'subscriber'
                                ? 'Assinante'
                                : ''
                            }
                            size="small"
                            variant="filled"
                            color={
                              author_roles[0] === 'administrator'
                                ? 'error'
                                : author_roles[0] === 'editor'
                                ? 'primary'
                                : author_roles[0] === 'author'
                                ? 'secondary'
                                : author_roles[0] === 'contributor'
                                ? 'success'
                                : author_roles[0] === 'subscriber'
                                ? 'warning'
                                : ''
                            }
                          />
                        </>
                      }
                      subheader={new Date(date).toLocaleDateString('pt-BR')}
                      action={
                        parseInt(dataUser.id) === parseInt(author_id) && (
                          <>
                            <Tooltip
                              title={
                                editComment.id === id && editComment.isEditing
                                  ? 'Cancelar'
                                  : 'Editar'
                              }
                            >
                              <IconButton
                                aria-label={editComment ? 'Cancelar' : 'Editar'}
                                sx={{ padding: '6px' }}
                                onClick={() =>
                                  setEditComment((prev) => ({
                                    id,
                                    isEditing:
                                      prev.id === id ? !prev.isEditing : true,
                                  }))
                                }
                              >
                                <Icon
                                  icon={
                                    editComment.id === id &&
                                    editComment.isEditing
                                      ? 'close'
                                      : 'pencil'
                                  }
                                  size={22}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Apagar">
                              <IconButton
                                aria-label="Apagar"
                                color="error"
                                onClick={() =>
                                  handleOpenConfirmDelete(id, content)
                                }
                              >
                                <Icon
                                  icon="bin"
                                  size={18}
                                  color="var(--mui-palette-red-c800)"
                                />
                              </IconButton>
                            </Tooltip>
                          </>
                        )
                      }
                    />
                    <CardContent>
                      {editComment.id === id && editComment.isEditing ? (
                        <>
                          <TextField
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            multiline
                            defaultValue={content}
                            size="small"
                            sx={{
                              margin: '0 0 -1px -15px',
                              width: 'calc(100% + 30px)',
                              '& .MuiOutlinedInput-root': {
                                minHeight: '100px',
                                alignItems: 'start',
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: '4px 4px 0 0',
                              },
                            }}
                          />
                          <Button
                            loading={isPostingEdit}
                            variant="contained"
                            size="xsmall"
                            startIcon={<Icon icon="floppy-disk" />}
                            sx={{
                              margin: '0 0 -1px -15px',
                              width: 'calc(100% + 30px)',
                              borderRadius: '0 0 4px 4px',
                            }}
                            onClick={() => handlePutComment(id)}
                          >
                            Salvar
                          </Button>
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {content}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ),
              )
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  flexDirection: 'column',
                }}
              >
                <Icon
                  icon="writing_18655692.json"
                  trigger="loop"
                  size={100}
                  lottieColors={{
                    primary:
                      mode === 'dark'
                        ? BaseColors.White.main
                        : BaseColors.Black.main,
                    secondary:
                      mode === 'dark'
                        ? BaseColors.White.main
                        : BaseColors.Black.main,
                  }}
                  stroke={0.1}
                />
                <Typography textAlign="start">
                  Seja o primeiro(a) a comentar!
                </Typography>
              </div>
            )}
          </Box>
          <Box
            component="form"
            onSubmit={submitPostComment}
            className="comment-new content-group"
          >
            <TextField
              id="outlined-multiline-static"
              label="Escreva seu comentário"
              multiline
              variant="filled"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isPosting}
            />
            <Button
              type="submit"
              size="small"
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<Icon icon="speak-plus" />}
              loading={isPosting}
              disabled={!newComment.trim()}
            >
              {isPosting ? 'Postando...' : 'Postar comentário'}
            </Button>
          </Box>
          <Dialog
            open={openConfirmDelete.dialog}
            onClose={() => handleCloseConfirmDelete(openConfirmDelete.content)}
            aria-labelledby="confirm-delete-comment"
            aria-describedby="confirm-delete-comment-description"
            className="dialog-confirm"
          >
            <DialogTitle>Deletar comentário</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Você confirma a exclusão do comentário: <br /> "
                <b>{openConfirmDelete.content}</b>
                "?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color={mode === 'dark' ? 'black' : 'white'}
                size="small"
                onClick={() =>
                  handleCloseConfirmDelete(openConfirmDelete.content)
                }
                autoFocus
              >
                Não excluir
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() =>
                  handleConfirmedDelete(
                    openConfirmDelete.id,
                    openConfirmDelete.content,
                  )
                }
              >
                Excluir
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SingleComments;
