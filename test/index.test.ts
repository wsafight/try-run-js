import {
  tryRun,
  setReturnType
} from '../src/index'

describe('try-run-js', () => {
  it('a promise', async () => {
    const { result } = await tryRun(Promise.resolve(12))
    expect(result).toEqual(12)
  })

  it('a promise error', async () => {
    const { error } = await tryRun(Promise.reject(12))
    expect(error).toEqual(12)
  })

  it('a promise funciont error', async () => {
    const { error } = await tryRun(() => {
      return Promise.reject(12)
    })
    expect(error).toEqual(12)
  })

  it('retry Promise', async () => {
    let index = 1
    const { result } = await tryRun<any>(() => {
      index++;
      if (index === 3) {
        return Promise.resolve(222)
      }
      return Promise.reject(12)
    }, {
      retryTime: 3
    })
    expect(result).toEqual(222)
  })


  it('document error', async () => {
    const { error } = await tryRun(() => {
      document.getElementById('1231')
    }, {
      retryTime: 3
    })
    expect(error).toEqual(new ReferenceError('document is not defined'))
  })

  it('Promise', async () => {
    let time = 0
    await tryRun(() => {
      time++
      document.getElementById('1231')
    }, {
      retryTime: 3
    })
    expect(time).toEqual(4)
  })


  it('Promise', async () => {
    let time = 0
    const { result } =  await tryRun(() => {
      time++
      if (time === 4) {
        return 'success'
      } else {
        throw new Error('hahah')
      }
    }, {
      retryTime: 3
    })
    expect(result).toEqual('success');
  })

  it('tuple', async () => {
    let time = 0
    const [_error, result] =  await tryRun(() => {
      time++
      if (time === 4) {
        return 'success'
      } else {
        throw new Error('hahah')
      }
    }, {
      retryTime: 3,
      returnType: 'tuple'
    })
    expect(result).toEqual('success');
  })

  it('tuple', async () => {
    let time = 0
    const [error, _result] =  await tryRun(() => {
      time++
      if (time === 6) {
        return 'success'
      } else {
        throw new Error('hahah')
      }
    }, {
      retryTime: 3,
      returnType: 'tuple'
    })
    expect(error).toEqual(new Error('hahah'));
  })

  it('global tuple', async () => {
    setReturnType("tuple")
    let time = 0
    const [error] =  await tryRun(() => {
      time++
      if (time === 6) {
        return 'success'
      } else {
        throw new Error('hahah')
      }
    }, {
      retryTime: 0,
    })
    expect(error).toEqual(new Error('hahah'));
  })

  // it('global tuple', async () => {
  //   setReturnType("tuple")
  //   let time = 0
  //   const {error} =  await tryRun(() => {
  //     time++
  //     if (time === 6) {
  //       return 'success'
  //     } else {
  //       throw new Error('hahah')
  //     }
  //   }, {
  //     retryTime: 0,
  //     returnType: 'record'
  //   })
  //   expect(error).toEqual(new Error('hahah'));
  // })
})