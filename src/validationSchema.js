import * as Yup from 'yup';

const regex = /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm

export const inputSchema = Yup.object().shape({
  url: Yup.string().matches(regex, "Invalid Url")
});