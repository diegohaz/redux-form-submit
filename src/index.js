import {
  initialize,
  isValid,
  touch,
  getFormValues,
  setSubmitFailed,
  startSubmit,
  stopSubmit,
  setSubmitSucceeded,
  startAsyncValidation,
  stopAsyncValidation
} from 'redux-form'
import { updateSyncErrors, registerField } from 'redux-form/lib/actions'
import handleSubmit from 'redux-form/lib/handleSubmit'
import asyncValidation from 'redux-form/lib/asyncValidation'

const submit = (config, values) => (dispatch, getState) => {
  const { form, validate, onSubmit, asyncValidate } = config
  let { fields } = config
  const formState = getState().form[form]
  values = values || getFormValues(form)(getState()) || {}

  if (!formState) {
    dispatch(initialize(form, values))
    fields.forEach((field) => {
      dispatch(registerField(form, field, 'Field'))
    })
    values = getFormValues(form)(getState())
  } else if (formState.registeredFields) {
    fields = formState.registeredFields.map((field) => field.name)
  } else {
    throw new Error('You must set fields on redux-form config')
  }

  if (typeof validate === 'function') {
    dispatch(updateSyncErrors(form, validate(values)))
  }

  const props = {
    ...config,
    dispatch,
    startSubmit: () => dispatch(startSubmit(form)),
    stopSubmit: (...args) => dispatch(stopSubmit(form, ...args)),
    setSubmitFailed: (...args) => dispatch(setSubmitFailed(form, ...args)),
    setSubmitSucceeded: () => dispatch(setSubmitSucceeded(form)),
    syncErrors: getState().form[form].syncErrors,
    touch: (...args) => dispatch(touch(form, ...args)),
    values
  }

  return Promise.resolve().then(() => handleSubmit(
    onSubmit,
    props,
    isValid(form, (state) => state.form)(getState()),
    asyncValidate && asyncValidation.bind(
      null,
      () => asyncValidate(values, dispatch, props),
      () => dispatch(startAsyncValidation(form)),
      (...args) => dispatch(stopAsyncValidation(form, ...args))
    ),
    fields
  ))
}

export default submit
