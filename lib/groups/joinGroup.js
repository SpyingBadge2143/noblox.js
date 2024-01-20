// Includes
const http = require('../util/http.js').func
const getCurrentUser = require('../util/getCurrentUser').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group']
exports.optional = []

// Docs
/**
 * 🔐 Join a group.
 * @category Group
 * @alias joinGroup
 * @param {number} group - The id of the group.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.joinGroup(1)
**/

// Define
function joinGroup (group, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/users/`,
      options: {
        method: 'POST',
        resolveWithFullResponse: true,
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          resolve()
        }
      }).catch(error => reject(error))
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(async function (xcsrf) {
      const currentUser = await getCurrentUser({ jar: jar })
      return joinGroup(args.group, args.jar, xcsrf, currentUser.UserID)
    })
}
