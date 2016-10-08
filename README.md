# redux-form-submit

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

Adds a submit action creator to [redux-form](https://github.com/erikras/redux-form)

**Attention: this library uses internal methods of [redux-form](https://github.com/erikras/redux-form)**

## The Problem

[redux-form](https://github.com/erikras/redux-form) doesn't provide a way to submit a form by dispatching an action. This module works like a plugin that exports a `submit` action creator to do that with a few [limitations](#limitations).

## Install

```sh
npm install --save redux-form-submit
```

## Usage

First, as this is asynchronous, you need to apply the [redux-thunk](https://github.com/gaearon/redux-thunk) middleware to the store. Then, for every form you want to submit with redux-form-submit you need to expose the config object passed to redux-form. For example:

**MyForm.js**
```js
import React from 'react'
import { reduxForm, Field } from 'redux-form'

const MyForm = () => {
  return (
    <form>
      <Field name="input1" component="input" />
      <Field name="input2" component="input" />
    </form>
  )
}

const onSubmit = (values) => {
  if (values.input1 !== 'right value') {
    throw { input1: 'Please, provide a right value' }
  }
}

// Exports the redux-form config
export const config = {
  form: 'myForm',
  fields: ['input1', 'input2'],
  onSubmit
}

export default reduxForm(config)(MyForm)
```

**elsewhere.js**
```js
import submit from "redux-form-submit"
import { config } from './MyForm'

dispatch(submit(config))
// or send initial values
dispatch(submit(config, { input1: 'wrong value' }))
```

## Limitations

As this has nothing to do with the form component, it:
 - can't call custom submit methods other than `onSubmit`;
 - can't identify the field types, so it only works with `Field`;
 - can't pass `props` to `onSubmit`, `asyncValidate` etc.

## License

MIT © [Diego Haz](http://github.com/diegohaz)

[npm-url]: https://npmjs.org/package/redux-form-submit
[npm-image]: https://img.shields.io/npm/v/redux-form-submit.svg?style=flat-square

[travis-url]: https://travis-ci.org/diegohaz/redux-form-submit
[travis-image]: https://img.shields.io/travis/diegohaz/redux-form-submit.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/diegohaz/redux-form-submit
[coveralls-image]: https://img.shields.io/coveralls/diegohaz/redux-form-submit.svg?style=flat-square

[depstat-url]: https://david-dm.org/diegohaz/redux-form-submit
[depstat-image]: https://david-dm.org/diegohaz/redux-form-submit.svg?style=flat-square

[download-badge]: http://img.shields.io/npm/dm/redux-form-submit.svg?style=flat-square
