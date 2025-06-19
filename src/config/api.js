import { PublicJsonApiCall, PrivateMultipartDataApiCall, PrivateJsonDataApiCall  } from "./interceptors";

const errorCatch = (error) => {
    console.log('err', error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return error.response || error;
  };

// Login
 export async function Signin(data) {
    const resp = await PublicJsonApiCall.post('users/login', data)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////POSTS//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

export async function addPost(data) {
    const resp = await PrivateMultipartDataApiCall.post('posts', data)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function editPost(id, data) {
    const resp = await PrivateJsonDataApiCall.put(`posts/${id}`, data)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function deletePost(id) {
    const resp = await PrivateJsonDataApiCall.delete(`posts/${id}`)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function getPosts() {
    const resp = await PrivateMultipartDataApiCall.get('posts')
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function getProfilePosts(id, role) {
    const resp = await PrivateMultipartDataApiCall.get(`posts/profile/${id}/${role}`)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function likePost(postId) {
    const resp = await PrivateMultipartDataApiCall.post(`likes/${postId}`)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

   export async function getComments(id) {
    const resp = await PrivateMultipartDataApiCall.get(`comments/${id}`)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function addComment(id, data) {
    const resp = await PrivateJsonDataApiCall.post(`comments/${id}`, data)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function editComment(id, data) {
    const resp = await PrivateJsonDataApiCall.put(`comments/${id}`, data)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function deleteComment(id) {
    const resp = await PrivateJsonDataApiCall.delete(`comments/${id}`)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////USERS//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

export async function getAllUsers(queryParams) {
  const resp = await PrivateMultipartDataApiCall.get('users', {
    params: queryParams,
  })
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function getUser(role, id) {
  const resp = await PrivateMultipartDataApiCall.get(`users/${role}/${id}`)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function updateProfile(role, id, data) {
  const resp = await PrivateMultipartDataApiCall.put(`users/profile/${role}/${id}`, data)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function getAllStudents(queryParams) {
  const resp = await PrivateMultipartDataApiCall.get('users/student', {
    params: queryParams,
  })
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function getAllInstructors(queryParams) {
  const resp = await PrivateMultipartDataApiCall.get('users/instructor', {
    params: queryParams,
  })
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function getAllAlumnis(queryParams) {
  const resp = await PrivateMultipartDataApiCall.get('users/alumni', {
    params: queryParams,
  })
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function getAllEmployers(queryParams) {
  const resp = await PrivateMultipartDataApiCall.get('users/employer', {
    params: queryParams,
  })
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function addUser(data) {
  const resp = await PrivateJsonDataApiCall.post('users', data)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function editUser(id,type, data) {
  const resp = await PrivateJsonDataApiCall.put(`users/${type}/${id}`, data)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function deleteUser(id,type) {
  const resp = await PrivateJsonDataApiCall.delete(`users/${type}/${id}`)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////PORTFOLIOS/////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

export async function getAllPortfolios() {
  const resp = await PrivateMultipartDataApiCall.get('portfolios')
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function getPortfolioById(id) {
  const resp = await PrivateMultipartDataApiCall.get(`portfolios/${id}`)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function viewPortfolio(id) {
  const resp = await PrivateMultipartDataApiCall.put(`portfolios/view/${id}`)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function getSuggestions(id) {
    const resp = await PrivateMultipartDataApiCall.get(`portfolios/suggestions/${id}`)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function addSuggestion(id, data) {
    const resp = await PrivateJsonDataApiCall.post(`portfolios/suggestions/${id}`, data)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function editSuggestion(id, data) {
    const resp = await PrivateJsonDataApiCall.put(`portfolios/suggestions/${id}`, data)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function deleteSuggestion(id) {
    const resp = await PrivateJsonDataApiCall.delete(`portfolios/suggestions/${id}`)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function sharePortfolio(id) {
    const resp = await PrivateJsonDataApiCall.post(`portfolios/${id}/share`)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function getSharedPortfolio(token) {
    const resp = await PrivateJsonDataApiCall.get(`portfolios/shared/${token}`)
      .then((response) => response)
      .catch((error) => errorCatch(error));
    return resp;
  }

  export async function editPortfolio(id, data) {
  const resp = await PrivateMultipartDataApiCall.put(`portfolios/${id}`, data)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}
export async function addSection(id, data) {
  console.log('data', data);
  const resp = await PrivateMultipartDataApiCall.post(`portfolios/section/${id}`, data)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function editSection(id, data) {
  const resp = await PrivateMultipartDataApiCall.put(`portfolios/section/${id}`, data)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function deleteSection(id) {
  const resp = await PrivateMultipartDataApiCall.delete(`portfolios/section/${id}`)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////JOB-LISTINGS///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

export async function getAllListings() {
  const resp = await PrivateMultipartDataApiCall.get('job-listings')
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function addListing(data) {
  const resp = await PrivateJsonDataApiCall.post('job-listings', data)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function editListing(id, data) {
  const resp = await PrivateJsonDataApiCall.put(`job-listings/${id}`, data)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}

export async function deleteListing(id) {
  const resp = await PrivateJsonDataApiCall.delete(`job-listings/${id}`)
    .then((response) => response)
    .catch((error) => errorCatch(error));
  return resp;
}
  