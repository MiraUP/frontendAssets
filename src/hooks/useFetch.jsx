/**
 * funções de requisições para a API do MiraUP
 *
 * @package MiraUP
 * @subpackage API functions fetch
 * @author MiraUP <miraup.com.br>
 * @link https://miraup.com.br
 * @since 1.0.0
 * @version 1.0.0
 */

// Ambientes da API
export const API_URL = window.location.origin.includes('miraup.com.br')
  ? 'https://api.miraup.com.br/json'
  : window.location.hostname.includes('localhost')
  ? 'http://miraup.test/json'
  : window.location.hostname.includes('192.168.') &&
    'https://192.168.0.42/json';

/**
 * Envia uma requisição POST para obter o token JWT
 *
 * @param {*} body - Dados do usuário para autenticação. Ex: { username: 'user', password: 'pass' }
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function TOKEN_POST(body) {
  return {
    url: API_URL + '/jwt-auth/v1/token',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

/**
 * Recebe um token JWT e envia uma requisição POST para validar o token
 *
 * @param {string} token - Token JWT a ser validado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function TOKEN_VALIDATE_POST(token) {
  return {
    url: API_URL + '/jwt-auth/v1/token/validate',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição GET para buscar dados de um usuário
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function USER_GET(token) {
  return {
    url: API_URL + '/api/v1/user',
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição GET para buscar dados de um usuário
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function USERS_GET(token) {
  return {
    url: API_URL + '/api/v1/users',
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição POST para criar um novo usuário
 *
 * @param {Object} body - Dados do usuário a serem criados.
 */
export function USER_POST(body) {
  return {
    url: API_URL + '/api/v1/user',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

/**
 * Envia uma requisição PUT para atualizar os dados de um usuário
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @param {Object} body - Dados do usuário a serem atualizados.
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */

export function USER_PUT(token, body) {
  return {
    url: API_URL + '/api/v1/user',
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  };
}

/**
 * Envia uma requisição PUT para atualizar o código de verificação do usuário
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @param {Object} body - Dados do código a serem atualizados.
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function USER_CODE_PUT(token, body) {
  return {
    url: API_URL + '/api/v1/user/code',
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  };
}

/**
 * Envia uma requisição POST para gerar um novo código de verificação para o usuário
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function USER_NEW_CODE(token) {
  return {
    url: API_URL + '/api/v1/user/new-code',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição POST para solicitar a recuperação de senha
 *
 * @param {Object} body - Dados necessários para a recuperação de senha, como email ou nome de usuário.
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function LOST_PASS(body) {
  return {
    url: API_URL + '/api/v1/password/lost',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

/**
 * Envia uma requisição POST para resetar a senha após o início do processo de recuperação
 *
 * @param {Object} body - Dados necessários para a recuperação de senha, como email ou nome de usuário.
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function RESET_PASS(body) {
  return {
    url: API_URL + '/api/v1/password/reset',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

/**
 * Envia uma requisição GET para buscar dados de um usuário
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function NOTIFICATIONS_GET(token) {
  return {
    url: API_URL + '/api/v1/notifications',
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição POST para enviar uma notificação de erro no sistema
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @param {string} body - Formulário com os dados para API
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function NOTIFICATION_ERROR(token, body) {
  return {
    url: API_URL + '/api/v1/notification-error',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  };
}

/**
 * Envia uma requisição GET para buscar dados estatísticos
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function STATISTICS_GET(token) {
  return {
    url: API_URL + '/api/v1/statistics',
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição POST para registrar dados estatísticos
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function STATISTICS_POST(token) {
  return {
    url: API_URL + '/api/v1/statistics',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição GET para buscar dados do sistema
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function SYSTEM_GET(token) {
  return {
    url: API_URL + '/api/v1/system-info',
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição GET para buscar dados das taxonomias
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function TAXONOMY_GET(token) {
  return {
    url: API_URL + '/api/v1/taxonomy',
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição GET para buscar dados dos Ativos Digitais
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function ASSETS_GET(token) {
  return {
    url: API_URL + '/api/v1/asset',
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição GET para pequisar por Ativos Digitais
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function ASSETS_SEARCH(token) {
  return {
    url: API_URL + '/api/v1/asset-search',
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição POST para atualizar um Ativo Digital
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @param {string} body - Formulário com os dados para API
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function ASSETS_PUT(token, body) {
  return {
    url: API_URL + '/api/v1/asset-put',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: body,
    },
  };
}

/**
 * Envia uma requisição POST para fazer o upload de uma ou mais mídias para um Ativo Digital
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @param {string} body - Formulário com os dados para API
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function MEDIA_POST(token, body) {
  return {
    url: API_URL + '/api/v1/media',
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: body,
    },
  };
}

/**
 * Envia uma requisição GET para buscar uma ou mais mídias de um Ativo Digital
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function MEDIA_GET(token) {
  return {
    url: API_URL + '/api/v1/media',
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição GET para buscar uma ou mais mídias de um Ativo Digital
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function MEDIA_PUT(token) {
  return {
    url: API_URL + '/api/v1/media',
    options: {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição DELETE para remover uma mídia de um Ativo Digital
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function MEDIA_DELETE(token) {
  return {
    url: API_URL + '/api/v1/media',
    options: {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Atualiza a condição Ativos Digitais favoritado pelo usuário
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @param {string} id - ID do usuário responsável pela ação
 * @param {string} favorite - ID do post que está sendo favoritado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function FAVORITE_PUT(token, userId, { post_id, favorite }) {
  return {
    url: API_URL + '/api/v1/favorite',
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        post_id: post_id,
        favorite: Boolean(favorite),
      }),
    },
  };
}

/**
 * Envia uma requisição GET para buscar os previews (Ícones) dos Ativos Digitais
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function PREVIEWS_GET(token) {
  return {
    url: API_URL + '/api/v1/previews',
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição GET para buscar a lista de comentários de um Ativos Digitais
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function COMMENT_GET(token) {
  return {
    url: API_URL + '/api/v1/comment',
    options: {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

/**
 * Envia uma requisição POST para cadastrar um comentário para um Ativos Digitais
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @param {string} newComment - Texto de comentário do novo
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function COMMENT_POST(token, newComment) {
  return {
    url: API_URL + '/api/v1/comment',
    options: {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        comment: newComment,
      }),
    },
  };
}

/**
 * Envia uma requisição PUT para editar um comentário
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @param {string} editedComment - Texto novo do comentário editado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function COMMENT_PUT(token, editedComment) {
  return {
    url: API_URL + '/api/v1/comment',
    options: {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: editedComment,
      }),
    },
  };
}

/**
 * Envia uma requisição PUT para editar um comentário
 *
 * @param {string} token - Token JWT do usuário autenticado
 * @param {string} editedComment - Texto novo do comentário editado
 * @returns {Object} - Objeto contendo a URL e as opções da requisição
 */
export function COMMENT_DELETE(token) {
  return {
    url: API_URL + '/api/v1/comment',
    options: {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}
