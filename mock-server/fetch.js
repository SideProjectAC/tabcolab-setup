const newGroup = {
  id: "dbf4",
  name: "New Group",
};

fetch("http://3.115.208.60:4000/groups", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newGroup),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const updatedGroup = {
  id: "dbf4",
  name: "Updated Group",
};

fetch("http://3.115.208.60:4000/groups/dbf4", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(updatedGroup),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

fetch("http://localhost:4000/users/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John",
  }),
})
  .then(async (response) => {
    if (!response.ok) {
      return response.text().then((text) => {
        try {
          // 嘗試將響應解析為 JSON
          const error = JSON.parse(text);
          throw new Error(error.message);
        } catch {
          // 如果解析失敗，則拋出原始響應
          throw new Error(text);
        }
      });
    }
    return response.json();
  })
  .then((data) => console.log(data))
  .catch((error) => {
    // 這裡將顯示 Joi 的錯誤訊息
    console.error("Error:", error.message);
  });
