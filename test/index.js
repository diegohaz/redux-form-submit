import test from 'tape'
import thunk from 'redux-thunk'
import { combineReducers, applyMiddleware, createStore } from 'redux'
import { SubmissionError, reducer } from 'redux-form'
import submit from '../src'

const validate = (values) => {
  const errors = {}
  if (values.input1 === 'wrong') {
    errors.input1 = 'wrong'
  }
  return errors
}

const asyncValidate = (values) => {
  if (values.input2 === 'wrong') {
    return Promise.reject({ input2: 'wrong' })
  }
  return Promise.resolve()
}

const onSubmit = (values) => {
  if (values.input1 !== 'right') {
    return Promise.reject(new SubmissionError({ input1: 'not right' }))
  }
  return Promise.resolve()
}

const reduxFormConfig = {
  form: 'testForm',
  fields: ['input1', 'input2'],
  validate,
  asyncValidate,
  onSubmit
}

const mockStore = () => createStore(combineReducers({ form: reducer }), applyMiddleware(thunk))

const prepareStore = (values) => {
  const { dispatch, getState } = mockStore()
  return {
    submit: () => dispatch(submit(reduxFormConfig, values)),
    getFormState: () => getState().form.testForm
  }
}

test('initial state', (t) => {
  const { getFormState, submit } = prepareStore()
  submit().then(() => {
    const formState = getFormState()
    t.ok(formState, 'should have form state')
    t.ok(formState.registeredFields, 'should have registeredFields')
    t.equal(formState.registeredFields.length, 2, 'registeredFields should have length of 2')
    t.end()
  })
})

test('values', (t) => {
  const { getFormState, submit } = prepareStore({ input1: 'right' })
  submit().then(() => {
    const formState = getFormState()
    t.ok(formState.values, 'should have values')
    t.equal(formState.values.input1, 'right', 'should set right value')
    t.end()
  })
})

test('syncErrors', (t) => {
  const { getFormState, submit } = prepareStore({ input1: 'wrong' })
  submit().then((syncErrors) => {
    const formState = getFormState()
    t.same(syncErrors, { input1: 'wrong' }, 'should result error')
    t.ok(formState.syncErrors, 'should have syncErrors')
    t.equal(formState.syncErrors.input1, 'wrong', 'should have input1 syncError')
    t.end()
  })
})

test('asyncErrors', (t) => {
  const { getFormState, submit } = prepareStore({ input2: 'wrong' })
  submit().catch((asyncErrors) => {
    const formState = getFormState()
    t.same(asyncErrors, { input2: 'wrong' }, 'should result error')
    t.ok(formState.asyncErrors, 'should have asyncErrors')
    t.equal(formState.asyncErrors.input2, 'wrong', 'should have input2 syncError')
    t.end()
  })
})
