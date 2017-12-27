import window from 'global/window'

export default (() => {
  const env = {
    'NODE_ENV': process.env.NODE_ENV,
    'MODE': 'client',
    'SERVER_RENDERING': process.env.SERVER_RENDERING,
    'API_HOST': process.env.API_HOST
  }

  if (window.env) {
    window.env = Object.assign(env, window.env)
  }

  return env
})()
