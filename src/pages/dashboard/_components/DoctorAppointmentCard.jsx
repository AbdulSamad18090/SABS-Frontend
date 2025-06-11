import React from 'react'
import { getInitials, getStatusBadge } from '../dashboardUtils'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock, Eye, MoreHorizontal, Phone, XCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const DoctorAppointmentCard = ({ appointment, showDate = false }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {getInitials(appointment.patient_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {appointment.patient_name}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {showDate
                    ? `${appointment.date} at ${appointment.time}`
                    : appointment.time}
                </div>
                <span className="text-muted-foreground">•</span>
                <span>{appointment.type}</span>
                <span className="text-muted-foreground">•</span>
                <span>{appointment.duration}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(appointment.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Patient
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DoctorAppointmentCard
