import { useState } from "react";
import { API_URL } from "../utils/config";
import axios from "axios";
const Register = () => {
  const [name, setName] = useState("penny");
  const [email, setEmail] = useState("penny@gmail.com");
  const [password, setPassword] = useState("testtest");
  const [confirmPassword, setConfirmPassword] = useState("testtest");
  const [photo, setPhoto] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO:可以送出註冊資料到後端
    // TODO:上傳圖片
    try {
      // /auth/register
      // /auth/login
      // 不需要上傳檔案的版本
      // Content-Type:application/json
      // express 用 urlencoded / json可以解決
      //   let response = await axios.post(`${API_URL}/auth/register`, {
      //     name,
      //     email,
      //     password,
      //     confirmPassword,
      //   });
      //   console.log(response);
      // 需要上傳檔案的版本，需要透過formData
      // Content-Type:multipart/form-data
      // express 需要用到另外的 middleware 來處理
      let formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("photo", photo);
      let response = await axios.post(`${API_URL}/auth/register`,formData)
      console.log(response);
    } catch (e) {
      // 可以透過 e.response 拿到 axios 的 response
      console.error(e.response);
      // 前端：如何 ux 顯示錯誤訊息
      //   alert(e.response.data.message)
    }
  };

  return (
    <form
      className="bg-purple-100 h-screen md:h-full md:my-20 md:mx-16 lg:mx-28 xl:mx-40 py-16 md:py-8 px-24 text-gray-800 md:shadow md:rounded flex flex-col md:justify-center"
      onSubmit={handleSubmit}
    >
      <h2 className="flex justify-center text-3xl mb-6 border-b-2 pb-2 border-gray-300">
        註冊帳戶
      </h2>
      <div className="mb-4 text-2xl">
        <label htmlFor="name" className="flex mb-2 w-32">
          Email
        </label>
        <input
          className="w-full border-2 border-purple-200 rounded-md h-10 focus:outline-none focus:border-purple-400 px-2"
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="mb-4 text-2xl">
        <label htmlFor="name" className="flex mb-2 w-32">
          姓名
        </label>
        <input
          className="w-full border-2 border-purple-200 rounded-md h-10 focus:outline-none focus:border-purple-400 px-2"
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="mb-4 text-2xl">
        <label htmlFor="password" className="flex mb-2 w-16">
          密碼
        </label>
        <input
          className="w-full border-2 border-purple-200 rounded-md h-10 focus:outline-none focus:border-purple-400 px-2"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="mb-8 text-2xl">
        <label htmlFor="password" className="flex mb-2 w-32">
          確認密碼
        </label>
        <input
          className="w-full border-2 border-purple-200 rounded-md h-10 focus:outline-none focus:border-purple-400 px-2"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
      </div>
      <div className="mb-8 text-2xl">
        <label htmlFor="photo" className="flex mb-2 w-32">
          圖片
        </label>
        <input
          className="w-full border-2 border-purple-200 rounded-md h-10 focus:outline-none focus:border-purple-400 px-2"
          type="file"
          id="photo"
          name="photo"
          onChange={(e) => {
            setPhoto(e.target.files[0]);
          }}
        />
      </div>
      <button className="text-xl bg-indigo-300 px-4 py-2.5 rounded hover:bg-indigo-400 transition duration-200 ease-in">
        註冊
      </button>
    </form>
  );
};

export default Register;
