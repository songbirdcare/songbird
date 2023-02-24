import {
  Autocomplete,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  FormatSchedule,
  InsuranceData,
  RegionData,
  Schedule,
  SubRegion,
} from "@songbird/precedent-iso";
import React from "react";

const DATE = new Date().toLocaleDateString("en-US");

interface SendEmailArguments {
  schedule: Schedule;
  subject: string;
  familyName: string;
  signOff: string;
  childName: string;
}

export const SendEmail: React.FC<SendEmailArguments> = ({
  subject,
  familyName,
  signOff,
  childName,
  schedule,
}) => {
  const formattedSchedule = FormatSchedule.format(schedule);

  const [insurance, setInsurance] = React.useState<string | undefined>(
    undefined
  );
  const [region, setRegion] = React.useState<SubRegion | undefined>(undefined);
  const [startDate, setStartDate] = React.useState<string | undefined>(
    undefined
  );

  const selectedInsurance = InsuranceData.VALID_INSURANCE_PROVIDERS.find(
    (p) => p.slug === insurance
  );

  return (
    <Box display="flex" gap={3}>
      <Box display="flex" gap={3} flexDirection="column">
        <Autocomplete
          value={selectedInsurance ?? null}
          onChange={(_, newValue) => {
            if (newValue) {
              setInsurance(newValue.slug);
            }
          }}
          getOptionLabel={(provider) => provider?.label}
          options={InsuranceData.VALID_INSURANCE_PROVIDERS.sort(
            (a, b) => -b.label.localeCompare(a.label)
          )}
          sx={{ width: 300 }}
          renderInput={({ size, ...rest }) => (
            // eslint-disable-next-line
            // @ts-ignore
            <TextField
              variant="outlined"
              label="Select Insurance"
              size={size}
              {...rest}
            />
          )}
        />

        <Autocomplete
          value={region ?? null}
          onChange={(_, newValue) => {
            if (newValue) {
              setRegion(newValue);
            }
          }}
          options={RegionData.SUBREGIONS}
          sx={{ width: 300 }}
          groupBy={getPrefix}
          renderInput={({ size, ...rest }) => (
            // eslint-disable-next-line
            //@ts-ignore
            <TextField
              variant="outlined"
              label="Select Subregion"
              size={size}
              {...rest}
            />
          )}
        />

        <Box display="flex" gap={2} alignItems="center">
          <Box width="auto">
            <Typography noWrap>Start date</Typography>
          </Box>
          <input
            type="date"
            id="start"
            name="Projected Start Date:"
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            value={startDate}
            style={{
              width: "100%",
              padding: "8px",
            }}
            min={new Date().toISOString().split("T")[0]}
            max={
              new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                .toISOString()
                .split("T")[0]
            }
          />
        </Box>
        <Button
          disabled={
            region === undefined ||
            insurance === undefined ||
            startDate === undefined ||
            FormatSchedule.format(schedule).length === 0
          }
          variant="contained"
          onClick={() => console.log("hi")}
        >
          Send email
        </Button>
      </Box>
      <RenderEmail
        insurance={selectedInsurance?.label ?? ""}
        region={region ?? ""}
        subject={subject}
        familyName={familyName}
        signOff={signOff}
        childName={childName}
        formattedSchedule={formattedSchedule}
        startDate={startDate ?? ""}
      />
    </Box>
  );
};

interface RenderEmailArguments {
  subject: string;
  familyName: string;
  signOff: string;
  childName: string;
  formattedSchedule: string;
  region: string;
  insurance: string;
  startDate: string;
}

const RenderEmail: React.FC<RenderEmailArguments> = ({
  subject,
  signOff,
  childName,
  formattedSchedule,
  region,
  insurance,
  startDate,
}) => {
  return (
    <Paper>
      <Box display="flex" flexDirection="column" gap={1} padding={1}>
        <Typography sx={{ fontWeight: "bold" }}>Subject: {subject}</Typography>
        <Typography>Hi Breanna and Emily,</Typography>

        <Typography>
          We have a family that needs a BCBA. Can you please confirm which BCBA
          should be scheduled for this assessment?
        </Typography>
        <ul>
          <li>
            <Typography>Date/Time of Request: {DATE}</Typography>
          </li>
          <li>
            <Typography>
              Client&apos;s First and Last Name: {childName}
            </Typography>
          </li>
          <li>
            <Typography>Hiring Region: {region}</Typography>
          </li>
          <li>
            <Typography>Insurance: {insurance}</Typography>
          </li>
          <li>
            <Typography>Projected Start Date: {startDate}</Typography>
          </li>
          <li>
            <Box display="flex" gap={2}>
              <Box>
                <Typography>Session Availibility:</Typography>
              </Box>

              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {formattedSchedule}
              </Typography>
            </Box>
          </li>
        </ul>

        <Typography>Thanks,</Typography>
        <Typography>{signOff}</Typography>
      </Box>
    </Paper>
  );
};
function getPrefix(subregion: SubRegion): string {
  const [prefix] = subregion.split("-", 2);
  if (prefix === undefined) {
    throw new Error("illegal state");
  }
  return prefix;
}
