import inspect


def a(*args, **kwagrs):
    print("d")
    def f(func):
        print(func, dir(func), func.__class__, func.__qualname__, func.__module__, func.__name__)
        print("f")
        def d(*args, **kwagrs):
            print("ok")
            return func(*args, **kwagrs)
        return d
    return f


class A:
    @a("adf")
    def c(self):
        print("dfsafa")

