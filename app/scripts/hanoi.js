
export default function *hanoi(n, {from, to, using}) {
  if (n <= 1) {
    yield { disc:1, from:from, to:to };
  }
  else {
    yield* hanoi(n-1, {from:from, to:using, using:to});
    yield { disc:n, from:from, to:to };
    yield* hanoi(n-1, {from:using, to:to, using:from});
  }
}
