import { ICarRepository } from "../../domain/src/repository/ICarRepository";
import { Car } from "../../domain/src/Car";
import { CarValidator } from "../../domain/src/validator/CarValidator";
import * as moment from "moment";

const cars: Map<string, Car> = new Map<string, Car>();

export class MockCarRepository implements ICarRepository {
  private readonly validator: CarValidator = new CarValidator();

  public async Save(car: Car): Promise<Car> {
    if (this.validator.Validate(car) === false) {
      // TODO: Replace on custom exception
      throw new Error("Car entity is not valid");
    }

    cars.set(car.id, car);
    return car;
  }

  public async GetById(id: string): Promise<Car> {
    if (cars.has(id) === false) {
      // TODO: Replace on custom exception
      throw new Error("Cannot find car with id: " + id);
    }

    return cars.get(id);
  }

  public async DeleteById(id: string): Promise<Car> {
    if (cars.has(id) === false) {
      // TODO: Replace on custom exception
      throw new Error("Cannot find car with id: " + id);
    }
    const car = cars.get(id);
    cars.delete(id);
    return car;
  }

  public async GetAll(): Promise<Car[]> {
    return Array.from(cars.values());
  }

  async GetCarsForDiscount(): Promise<Car[]> {
    const a = Array.from(cars.values());
    const currentDate = new Date();
    return a.filter((car: Car) => {
      const months = moment(currentDate).diff(car.firstRegistrationDate, "months");
      return months >= 12;
    });
  }
}
