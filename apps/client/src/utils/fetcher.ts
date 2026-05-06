export default function fetcher<T>([url, token]: [url: string, token: string]) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json() as Promise<T>);
}
