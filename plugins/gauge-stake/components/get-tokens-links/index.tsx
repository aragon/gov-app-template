import {
  PUB_GET_MORE_TOKEN_2_URL,
  PUB_GET_MORE_TOKEN_1_URL,
  PUB_GET_MORE_BOTH_URL,
  TOKEN_1_NAME,
  TOKEN_2_NAME,
} from "../../constants";
import { Button, IconType } from "@aragon/ods";

const GetMoreTokens = () => {
  return (
    <div className="grid grid-cols-2 gap-4 py-3 lg:grid-cols-3">
      <Button
        href={PUB_GET_MORE_TOKEN_1_URL}
        target="_blank"
        variant="secondary"
        size="lg"
        responsiveSize={{ md: "md" }}
        iconRight={IconType.LINK_EXTERNAL}
      >
        Get {TOKEN_1_NAME}
      </Button>
      <Button
        href={PUB_GET_MORE_TOKEN_2_URL}
        target="_blank"
        variant="secondary"
        size="lg"
        responsiveSize={{ md: "md" }}
        iconRight={IconType.LINK_EXTERNAL}
      >
        Get {TOKEN_2_NAME}
      </Button>
      <Button
        href={PUB_GET_MORE_BOTH_URL}
        target="_blank"
        variant="secondary"
        size="lg"
        responsiveSize={{ md: "md" }}
        iconRight={IconType.LINK_EXTERNAL}
      >
        Get Both
      </Button>
    </div>
  );
};

export default GetMoreTokens;
