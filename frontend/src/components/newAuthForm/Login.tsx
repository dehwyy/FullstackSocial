import * as React from "react"
import {
  FlexBlock,
  FormCentered,
  FormWrapper,
  LoginOption,
  OptionsWrapper,
  OptionalText,
  Options,
  Form,
} from "./authComponents/AuthGlobal-styles"
import { Sign } from "./authComponents/Sign.style"
import { Button } from "./authComponents/Button-style"
import { AInputWrapper, AInput, ErrorSpan } from "./authComponents/Input-style"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import usernameValidation from "./validation/usernameValidation"
import { useNavigate } from "react-router-dom"
import Ico from "../../UI/Ico"
import login from "../../requests/login"
import { setAuth, setUserId } from "../../store/slices/currentUser-store"
import { useTypedDispatch } from "../../store/typed-hooks"
import passwordValidation from "./validation/passwordValidation"
import emailValidation from "./validation/emailValidation"

const LoginFormRouter = () => {
  //prettier-ignore
  const {register, formState: {errors, isValid}, reset, handleSubmit, getValues} = useForm({
    mode: "onBlur",
  })
  const [isReadyForSubmit, setReadyForSubmit] = useState(false)
  //prettier-ignore
  const [methodOfAuth, setMethodOfAuth] = useState<"email" | "username">("email")
  const [email, setEmail] = useState("")
  const [username, setUsernameHook] = useState("")
  const [passwordError, setPasswordError] = useState<string>("")
  const navigate = useNavigate()
  const dispatch = useTypedDispatch()
  const formRef = useRef<HTMLFormElement>(null)

  const submitHandler = async (data: Partial<AllFieldsDataForm>) => {
    const response = await login({ ...data, email, username }).catch(() => {
      setPasswordError(`Wrong password or ${methodOfAuth}!`)
    })
    if (response) {
      dispatch({ type: setAuth, payload: true })
      console.log(response.data.data.user.username, response.data.data.user)
      localStorage.setItem("currentUsername", response.data.data.user.username)
      dispatch({ type: setUserId, payload: response.data.data.user._id })
      navigate(`content/profile/${response.data.data.user._id}`)
    }
    reset()
  }
  const buttonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (isValid) {
      if (methodOfAuth === "email") {
        setEmail(getValues().email)
        setUsernameHook("")
      } else {
        setUsernameHook(getValues().username)
        setEmail("")
      }
      setReadyForSubmit(true)
      reset()
    }
  }
  return (
    <FormWrapper>
      <FormCentered>
        <OptionsWrapper>
          {isReadyForSubmit ? (
            <OptionalText>Enter Password</OptionalText>
          ) : (
            <Options>
              <LoginOption
                isChosen={methodOfAuth === "email"}
                onClick={() => {
                  setMethodOfAuth("email")
                  reset()
                }}>
                Email
              </LoginOption>
              <LoginOption
                isChosen={methodOfAuth === "username"}
                onClick={() => {
                  setMethodOfAuth("username")
                  reset()
                }}>
                Username
              </LoginOption>
            </Options>
          )}
        </OptionsWrapper>
        <Form onSubmit={handleSubmit(submitHandler)} ref={formRef}>
          {isReadyForSubmit ? (
            <AInputWrapper>
              <AInput
                placeholder="password"
                type="password"
                {...register("password", { ...passwordValidation })}
                onFocus={() => setPasswordError("")}
              />
              <ErrorSpan>{passwordError}</ErrorSpan>
            </AInputWrapper>
          ) : methodOfAuth === "username" ? (
            <AInputWrapper>
              <AInput placeholder="username" {...register("username", usernameValidation)} />
              {errors.username && <ErrorSpan>{errors.username.message as string}</ErrorSpan>}
            </AInputWrapper>
          ) : (
            <AInputWrapper>
              <AInput placeholder="email" {...register("email", emailValidation)} />
              {errors.email && <ErrorSpan>{errors.email.message as string}</ErrorSpan>}
            </AInputWrapper>
          )}
          <FlexBlock>
            {isReadyForSubmit ? (
              <Sign
                onClick={() => {
                  setReadyForSubmit(false)
                  setPasswordError("")
                  reset()
                }}>
                <Ico>arrow_back</Ico> Get back
              </Sign>
            ) : (
              <Sign onClick={() => navigate("registration")}>
                Don&apos;t have account? <br />
                Register now!
              </Sign>
            )}
            {isReadyForSubmit ? <Button type="submit">Next</Button> : <Button onClick={buttonHandler}>Next</Button>}
          </FlexBlock>
        </Form>
      </FormCentered>
    </FormWrapper>
  )
}

export default LoginFormRouter
