import "./App.css";
import ContractInfo from "./components/ContractInfo";
import { TopBar } from "./components/TopBar";
import ContractProofInfo from "./components/ContractProofInfo";
import { useLoadContractProof } from "./lib/useLoadContractProof";
import ContractSourceCode from "./components/ContractSourceCode";
import SubmitContractSteps from "./components/SubmitContractSteps";
import { useOverride } from "./lib/useOverride";
import { useFileStore } from "./lib/useFileStore";
import { useNavigate } from "react-router-dom";
import { useResetState } from "./lib/useResetState";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import { useContractAddress } from "./lib/useContractAddress";
import { useEffect, useRef } from "react";

const AppWrapper = styled(Box)({});

const ContentWrapper = styled(Box)({
  position: "relative",
  maxWidth: 1160,
  width: "100%",
  margin: "auto",
});

const PositionedContent = styled(Box)({
  position: "absolute",
  width: "100%",
  top: -141,
  left: 0,
});

const ContractDataWrapper = styled(Box)({
  display: "flex",
  gap: 20,
});

const OverflowingWrapper = styled(Box)({
  boxSizing: "border-box",
  maxWidth: 1160,
  width: "100%",
  marginTop: 20,
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 20,
  color: "#000",
});

const OverflowingFlexibleWrapper = styled(OverflowingWrapper)({
  flex: 1,
});

const examples_not_verified = [["wallet-v3", "EQBuOkznvkh_STO7F8W6FcoeYhP09jjO1OeXR2RZFkN6w7NR"]];

const examples = [
  ["dns-root", "Ef_lZ1T4NCb2mwkme9h2rJfESCE0W34ma9lWp7-_uY3zXDvq"],
  ["wallet-v4", "EQDerEPTIh0O8lBdjWc6aLaJs5HYqlfBN2Ruj1lJQH_6vcaZ"],
  ["dns-collection", "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"],
  ["dns-item", "EQAGSjhQajnMSne9c9hGnKdMKmohX2-MkZuOkk7TmwQKwFOU"],
  ["counter", "EQC-QTihJV_B4f8M2nynateMLynaRT_uwNYnnuyy87kam-G7"],
  ["jetton-minter-discoverable", "EQD-LkpmPTHhPW68cNfc7B83NcfE9JyGegXzAT8LetpQSRSm"],
  ["jetton-minter", "EQBb4JNqn4Z6U6-nf0cSLnOJo2dxj1QRuGoq-y6Hod72jPbl"],
  ["jetton-wallet", "EQAhuLHxOcrBwwMHKDnCUMYefuHwJ2iTOFKHWYQlDD-dgb__"],
  ["single-nominator", "Ef_BLbagjGnqZEkpURP96guu7M9aICAYe5hKB_P5Ng5Gju5Y"],
];

function App() {
  const { isLoading, data: proofData } = useLoadContractProof();
  const canOverride = useOverride();
  const { isAddressValid } = useContractAddress();
  const { hasFiles } = useFileStore();
  const navigate = useNavigate();
  const scrollToRef = useRef();
  useResetState();

  useEffect(() => {
    window.scrollTo({ behavior: "smooth", top: scrollToRef.current?.["offsetTop"] });
  }, [window.location.pathname]);

  return (
    <AppWrapper>
      <Box ref={scrollToRef} />
      <TopBar />
      <ContentWrapper>
        {isLoading && isAddressValid && <Box sx={{ marginTop: 4 }}>Loading...</Box>}
        <PositionedContent>
          {!isLoading && (
            <ContractDataWrapper>
              <OverflowingFlexibleWrapper>
                <ContractInfo />
              </OverflowingFlexibleWrapper>
              {proofData && proofData.hasOnchainProof && (
                <OverflowingFlexibleWrapper>
                  <ContractProofInfo />
                </OverflowingFlexibleWrapper>
              )}
            </ContractDataWrapper>
          )}
          {proofData && (!proofData.hasOnchainProof || canOverride) && (
            <OverflowingWrapper>
              <SubmitContractSteps />
            </OverflowingWrapper>
          )}
          {proofData && !hasFiles() && (
            <OverflowingWrapper>
              <ContractSourceCode />
            </OverflowingWrapper>
          )}
        </PositionedContent>
      </ContentWrapper>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "calc(50% - 400px)",
          marginTop: 20,
          display: "flex",
          gap: 10,
          background: "white",
          borderRadius: 20,
          padding: "10px 20px",
          width: 800,
          zIndex: 99,
          margin: "auto",
        }}>
        {examples.concat(examples_not_verified).map(([name, address]) => (
          <span
            style={{
              color: "blue",
              cursor: "pointer",
            }}
            key={name}
            onClick={() => {
              navigate(`/${address}`);
            }}>
            {name}
          </span>
        ))}
      </div>
    </AppWrapper>
  );
}

export default App;
