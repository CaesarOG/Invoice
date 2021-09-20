import { createAction } from 'typesafe-actions'

const secondActiveStep = createAction('@@signup/SECOND_ACTIVE_STEP',
    () => {
        return { activeStep: 1 as 0 | 1 }
    }
)()

const reset = createAction('@@signup/RESET',
    () => {
        return { activeStep: 0 as 0 | 1 }
    }
)()

const signupActions = {
    secondActiveStep,
    reset
};

export default signupActions
