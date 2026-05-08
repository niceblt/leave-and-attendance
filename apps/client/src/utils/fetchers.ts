export function fetcher([url, token]: [url: string, token: string]) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json());
}

export function externalFetcher(url: string) {
  return fetch(url).then((res) => res.json());
}

export async function updater<T>(
  url: string,
  { arg }: { arg: { token: string; data: T } },
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${arg.token}`,
    },
    body: JSON.stringify(arg.data),
  });

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.'");

    error.info = await res.json();
    error.status = 400;
    throw error;
  }

  return res.json();
}
