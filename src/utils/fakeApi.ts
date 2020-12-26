export const fakeApi = (value: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(value), 5000)
  })
}
