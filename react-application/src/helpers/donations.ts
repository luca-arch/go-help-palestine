const requestTimeoutSeconds = 15;

export type Campaign = {
  description: string;
  link: URL;
  title: string;
};

const getCampaigns = (endpoint: string): Promise<Campaign[]> => {
  return window
    .fetch(endpoint, {
      signal: AbortSignal.timeout(requestTimeoutSeconds * 1000),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      console.error(response);

      throw new Error(`Error: ${response.statusText}`);
    })
    .then((list: Campaign[]) => {
      return (
        list
          // Validate and cast to URL, return null if invalid.
          .map((item) => {
            let link;

            try {
              link = new URL(item.link);
            } catch (error) {
              console.warn("Invalid campaign", item, error);

              return null;
            }

            return {
              ...item,
              link,
            };
          })
          // Remove null elements.
          .filter((item: Campaign | null) => item !== null)
      );
    });
};

export const getCharitiesCampaigns = (): Promise<Campaign[]> =>
  getCampaigns("/api/list/charities");

export const getIndividualCampaigns = (): Promise<Campaign[]> =>
  getCampaigns("/api/list/individuals");
