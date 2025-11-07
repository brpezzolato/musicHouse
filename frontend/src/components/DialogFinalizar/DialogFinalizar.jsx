'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { TruckElectric, TriangleAlertIcon } from 'lucide-react';

export default function DialogDemo({ formaPgto }) {
  let page = 1;
  if (formaPgto) {
    return (
      <>
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button className="bg-[var(--vermelho-vivo)] rounded-[15px] w-full text-white h-10">
                Finalizar Pedido <TruckElectric />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{formaPgto}</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name</Label>
                  <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Username</Label>
                  <Input
                    id="username-1"
                    name="username"
                    defaultValue="@peduarte"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </>
    );
  } else {
    return (
      <>
        <Button
          className="bg-[var(--vermelho-vivo)] rounded-[15px] w-full text-white h-10"
          onClick={() =>
            toast.custom(
              () => (
                <div className="bg-amber-700 pt-2 pb-2 shadow-lg w-[400px]">
                  <div className="flex items-center gap-2">
                    <TriangleAlertIcon className="size-7" />
                    <div>
                      <div className="font-semibold">Custom Toast</div>
                      <div className="text-sm opacity-90">
                        Built with your own JSX
                      </div>
                    </div>
                  </div>
                </div>
              ),
              { duration: 1000, position: 'top-right' }
            )
          }
        >
          Finalizar Pedido <TruckElectric />
        </Button>
      </>
    );
  }
}
