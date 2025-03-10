declare global {
  namespace React {
    interface ReactNode {
      children?: ReactNode
    }
  }
}

