export function errorMessage(message: string | null) {
  return {
    message: message || 'Something has gone awry ...',
  }
}
