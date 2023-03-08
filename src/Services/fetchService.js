function ajax(url, responseMethod, jwt, requestBody) {
  const fetchData = {
    headers: {
      "Content-Type": "application/json",
    },
    method: responseMethod,
  };

  if (jwt) {
    fetchData.headers.Authorization = `Bearer ${jwt}`;
  }

  if (requestBody) {
    fetchData.body = JSON.stringify(requestBody);
  }
  
  return fetch(url, fetchData).then((response) => {
    if (response.status === 200) return response.json();
  });
}

export default ajax;
