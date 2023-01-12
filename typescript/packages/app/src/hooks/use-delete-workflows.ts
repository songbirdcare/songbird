import useSWRMutation from "swr/mutation";

export const useDeleteWorkflows = () => {
  const swr = useSWRMutation(`/api/proxy/workflows/all`, async (url) => {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "signature",
      }),
    });
    return res.json();
  });

  return swr;
};
