//解析json
function parseJSON(response) {
    console.log(response)
    return response
}
//检查请求状态
function checkStatus(response) {
    if (response.status >= 200 && response.status < 500) {
        return response
    }
    const error = new Error(response.statusText)
    error.response = response
    throw error
}

export default function (options = {}) {
    let defaultOptions = {
        data: {},
        url: '',
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"

        },
        credentials: 'include',
        cache: "no-cache",
        mode: "no-cors"
    }
    options = Object.assign(defaultOptions, options)
    const { data, url, ..._tmpOptions } = options
    if (data && ["GET", "HEAD"].indexOf(options.method.toUpperCase()) == -1) {
        _tmpOptions.body = JSON.stringify(data)
    }

    return fetch(url, _tmpOptions).then(parseJSON)
    // .then(checkStatus).catch(err => console.log(err))
}