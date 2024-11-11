import { getAbortSignalTimeout } from "./share";

const requestTimeoutSeconds = 15;

export type Campaign = {
  clicks: number;
  description: string;
  id: string;
  link: URL;
  title: string;
};

const getCampaigns = (endpoint: string): Promise<Campaign[]> => {
  return window
    .fetch(endpoint, {
      signal: getAbortSignalTimeout(requestTimeoutSeconds),
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
          // Sort by number of clicks, ascending.
          .sort((a, b) => a.clicks - b.clicks)
      );
    });
};

export const getCampaignURL = (campaign: Campaign) =>
  new URL(`/api/campaign/${campaign.id}`, location.origin);

export const getCharitiesCampaigns = (): Promise<Campaign[]> =>
  getCampaigns("/api/list/charities");

export const getIndividualCampaigns = (): Promise<Campaign[]> =>
  getCampaigns("/api/list/individuals");

export const getWatermelonFamiliesCampaigns = (): Promise<Campaign[]> =>
  getCampaigns("/api/list/watermelon");
