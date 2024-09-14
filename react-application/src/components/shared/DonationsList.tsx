import {
  getCampaignURL,
  getCharitiesCampaigns,
  getIndividualCampaigns,
} from "src/helpers/donations";
import { useEffect, useState } from "react";
import type { Campaign } from "src/helpers/donations";
import ExternalLink from "./ExternalLink";
import styled from "styled-components";

// Number of Campaigns to show at once. Pagination is done client side.
const PAGE_SIZE = 12;

enum DonationType {
  Charities = "charities",
  Individuals = "individuals",
}

const Badge = styled.div`
  text-align: center;

  a {
    background-color: #043d2e;
    border: 3px solid #ffffff;
    border-radius: 20px;
    color: #ffffff;
    display: inline-block;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: bold;
    text-decoration: none;
    text-transform: uppercase;

    &:hover {
      background-color: #f74f22;
    }
  }
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0;
  padding: 0;
  text-align: justify;
`;

const Item = styled.li`
  border: solid 1px #babbc1;
  border-radius: 10px;
  color: #111111;
  display: block;
  font-size: 16px;
  line-height: 150%;
  list-style: none;
  margin: 12px;
  padding: 20px;
  width: 320px;

  > strong {
    display: block;
    font-size: 24px;
    margin-bottom: 12px;
    text-align: center;
  }

  > p {
    min-height: 50px;
  }
`;

const Paginator = styled.div`
  align-items: baseline;
  display: flex;
  justify-content: space-evenly;
  margin-top: 10px;

  a {
    font-size: 18px;

    &.disabled {
      cursor: not-allowed;
      opacity: 0.25;
    }
  }

  span {
    font-size: 14px;
  }
`;

type ResultsProps = {
  campaigns: Campaign[];
};

const Results: React.FC<ResultsProps> = ({ campaigns }) => {
  const [page, setPage] = useState(0);

  const lastPage = Math.ceil(campaigns.length / PAGE_SIZE) - 1;
  const start = page * PAGE_SIZE;
  const end = (page + 1) * PAGE_SIZE;

  const onClick = (e: React.MouseEvent, addPage: number) => {
    e.preventDefault();

    if (e.currentTarget.classList.contains("disabled")) {
      return;
    }

    setPage(page + addPage);

    document.getElementById("donation-switch")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <List>
        {campaigns.slice(start, end).map((item, index) => (
          <Item key={index}>
            <strong>{item.title}</strong>

            <p>{item.description}</p>

            <Badge>
              <ExternalLink url={getCampaignURL(item)}>
                Donate now
              </ExternalLink>
            </Badge>
          </Item>
        ))}
      </List>

      <Paginator>
        <a
          href="#"
          className={page === 0 ? `disabled` : ``}
          onClick={(e) => onClick(e, -1)}
        >
          Previous
        </a>

        <span>
          {start + 1} - {Math.min(end, campaigns.length)} (of {campaigns.length}
          )
        </span>

        <a
          href="#"
          className={page < lastPage ? `` : `disabled`}
          onClick={(e) => onClick(e, 1)}
        >
          Next
        </a>
      </Paginator>
    </>
  );
};

// Donations list browser.
const DonationsList: React.FC = () => {
  const [selectedType, setSelectedType] = useState(DonationType.Charities);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setIsLoading(true);
    setError(undefined);

    (selectedType === DonationType.Charities
      ? getCharitiesCampaigns()
      : getIndividualCampaigns()
    )
      .then((result) => setCampaigns(result))
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, [selectedType]);

  return (
    <>
      <p id="donation-switch">
        Show:
        <label>
          <input
            checked={selectedType === DonationType.Charities}
            onChange={() => setSelectedType(DonationType.Charities)}
            type="radio"
            value={DonationType.Charities}
          />
          &nbsp; Charities
        </label>
        <label>
          <input
            checked={selectedType === DonationType.Individuals}
            onChange={() => setSelectedType(DonationType.Individuals)}
            type="radio"
            value={DonationType.Individuals}
          />
          &nbsp; Individuals
        </label>
      </p>

      {error ? (
        <>{error.message}</>
      ) : isLoading ? (
        <>Loading...</>
      ) : (
        <Results campaigns={campaigns} />
      )}
    </>
  );
};

export default DonationsList;
