import { faker } from '@faker-js/faker'
import { delay, http, HttpResponse } from 'msw'

import { UserApi } from '@/api/user'

import { USER_LIST } from '../assets'

const signIn = http.post(`/manage/api${UserApi.SignIn}`, async ({ request }) => {
    const { credential, password } = await request.json()

    const user = USER_LIST.find((item) => item.username === credential)

    if (!user || user.password !== password) {
        return HttpResponse.json({
            status: 10001,
            message: 'Incorrect username or password.',
        })
    }

    return HttpResponse.json({
        status: 0,
        message: '',
        data: {
            user,
            accessToken: faker.string.uuid(),
            refreshToken: faker.string.uuid(),
        },
    })
})

const userList = http.get('/manage/api/user', async () => {
    await delay(1000)
    return HttpResponse.json(
        Array.from({ length: 10 }).map(() => ({
            fullname: faker.person.fullName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            address: faker.location.streetAddress(),
        })),
        {
            status: 200,
        },
    )
})

export default [signIn, userList]
