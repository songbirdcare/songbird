import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import {
  assertNever,
  CreateUserResponse,
  isValidEmail,
  PasswordValidationService,
} from "@songbird/precedent-iso";
import Image from "next/image";
import * as React from "react";
import useSWRMutation from "swr/mutation";

const CreateAccount: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState<{
    type: "error" | "success" | "empty";
    message: string;
  }>({ type: "empty", message: "" });
  const setErrorMessage = (message: string) =>
    setMessage({ type: "error", message });
  const setSuccessMessage = (message: string) =>
    setMessage({ type: "error", message });

  const [showPassword, setShowPassword] = React.useState(false);
  const clearMessage = () => setMessage({ type: "empty", message: "" });
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const { data, trigger, isMutating, error } =
    useSWRMutation<CreateUserResponse>(
      "/api/proxy/public-users/create",
      async (
        url: string,
        { arg }: { arg: { password: string; email: string } }
      ) => {
        console.log({ email, password });
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: arg.email,
            password: arg.password,
          }),
        });
        const data = await res.json();
        return data.data;
      }
    );

  React.useEffect(() => {
    if (error) {
      setErrorMessage("An unexpected error occurred");
    }
  }, [error]);

  const submit = () => {
    if (!isValidEmail(email)) {
      setErrorMessage("Please input a valid email");
      return;
    }
    const result = PasswordValidationService.validate(password);
    if (result.type === "error") {
      switch (result.code) {
        case "too_short":
          setErrorMessage(
            `Password must be at least ${PasswordValidationService.MIN_LENGTH} characters`
          );
          break;
        default:
          assertNever(result.code);
      }
      return;
    }
    trigger({ email, password });
  };

  React.useEffect(() => {
    if (!data) {
      return;
    }

    switch (data.type) {
      case "ok":
        setSuccessMessage("Account succesfully created");
        break;
      case "password":
        setErrorMessage(
          `Password must be at least ${PasswordValidationService.MIN_LENGTH} characters`
        );
        break;
      case "exists_in_auth0":
      case "exists_in_sql":
        setErrorMessage("This email is already associated with an account.");
        break;
      case "invalid_email":
        setErrorMessage("Please input a valid email");
        break;
      default:
        assertNever(data);
    }
  }, [data]);

  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Paper variant="outlined">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding={4}
          paddingBottom={5}
          gap={2}
        >
          <Box display="flex" justifyContent="center">
            <Image src="/songbird-logo.svg" alt="me" width="128" height="64" />
          </Box>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              clearMessage();
              submit();
            }}
          >
            <Grid
              container
              alignItems="center"
              direction="column"
              component={Box}
              gap={2}
            >
              <Grid item width="100%">
                <TextField
                  id="email-input"
                  name="Email"
                  label="Email address"
                  type="email"
                  value={email}
                  fullWidth
                  onChange={(e) => {
                    clearMessage();

                    setEmail(e.target.value);
                  }}
                  InputLabelProps={{ required: false }}
                />
              </Grid>
              <Grid item width="100%">
                <TextField
                  id="password-input"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"} // <-- This is where the magic happens
                  required
                  value={password}
                  fullWidth
                  onChange={(e) => {
                    clearMessage();
                    setPassword(e.target.value);
                  }}
                  inputProps={{
                    minLength: PasswordValidationService.MIN_LENGTH,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ required: false }}
                />
              </Grid>
              <Grid width="100%">
                <LoadingButton
                  loading={isMutating}
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    width: "100%",
                    textTransform: "none",
                  }}
                >
                  Continue
                </LoadingButton>
              </Grid>
              {message.type !== "empty" && (
                <Grid width="100%">
                  <Alert severity={message.type}>{message.message}</Alert>
                </Grid>
              )}
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
export default CreateAccount;
