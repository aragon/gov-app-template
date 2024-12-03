import { Card, IconType, Link, TabsContent, TabsList, TabsRoot, TabsTrigger } from "@aragon/ods";
import React from "react";
import { StakeToken } from "./tab";
import { Token } from "../../types/tokens";
import { TOKEN_1_NAME, TOKEN_2_NAME, PUB_STAKING_LEARN_MORE_URL } from "../../constants";

interface IStakeProps {
  onStake?: () => void;
}

export const Stake: React.FC<IStakeProps> = ({ onStake }) => {
  return (
    <Card className="w-full p-8">
      <TabsRoot defaultValue={TOKEN_1_NAME}>
        <TabsList>
          <TabsTrigger
            className="token-1-icon w-1/2 justify-center px-1 text-xl md:w-auto"
            label={TOKEN_1_NAME}
            value={TOKEN_1_NAME}
          />
          <TabsTrigger
            className="token-2-icon w-1/2 justify-center px-1 text-xl md:w-auto"
            label={TOKEN_2_NAME}
            value={TOKEN_2_NAME}
          />
        </TabsList>
        <TabsContent value={TOKEN_1_NAME} className="pt-4">
          <StakeToken token={Token.TOKEN_1} onStake={onStake} />
        </TabsContent>
        <TabsContent value={TOKEN_2_NAME} className="pt-4">
          <StakeToken token={Token.TOKEN_2} onStake={onStake} />
        </TabsContent>
      </TabsRoot>
      <div className="mt-5 text-center">
        <span>
          Please note that you will need to wait for the warmup and cooldown periods to complete in order to unstake.
        </span>
        <Link href={PUB_STAKING_LEARN_MORE_URL} iconRight={IconType.LINK_EXTERNAL} className="pl-1">
          Learn more
        </Link>
      </div>
    </Card>
  );
};
